// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YesNoMarket {
    struct Market {
        address streamer; // market creator
        string question;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = YES wins, false = NO wins
        uint256 yesPool;
        uint256 noPool;
        uint256 feeBps; // streamer fee in basis points (max 20%)
        uint256 yesCount; // unique voters on YES
        uint256 noCount;  // unique voters on NO
        uint256 streamerFeeClaimed;
        mapping(address => uint256) yes; // amount staked on YES by user
        mapping(address => uint256) no;  // amount staked on NO by user
        mapping(address => bool) yesVoter; // if user has ever voted YES
        mapping(address => bool) noVoter;  // if user has ever voted NO
        mapping(address => bool) claimed;  // has user claimed winnings
        bool exists;
    }

    event MarketCreated(uint256 indexed marketId, address indexed streamer, string question, uint256 endTime, uint256 feeBps);
    event Voted(uint256 indexed marketId, address indexed voter, bool outcome, uint256 amount);
    event Resolved(uint256 indexed marketId, bool outcome);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 amount);
    event StreamerFeeClaimed(uint256 indexed marketId, address indexed streamer, uint256 amount);

    uint256 public nextMarketId = 1;
    mapping(uint256 => Market) private markets;

    modifier onlyStreamer(uint256 marketId) {
        require(markets[marketId].exists, "no market");
        require(markets[marketId].streamer == msg.sender, "not streamer");
        _;
    }

    function createMarket(
        string calldata question,
        uint256 durationSeconds,
        uint256 feeBps
    ) external returns (uint256 marketId) {
        require(bytes(question).length > 0, "empty question");
        require(durationSeconds >= 60, "duration too short");
        require(feeBps <= 2_000, "fee too high"); // <= 20%

        marketId = nextMarketId++;
        Market storage m = markets[marketId];
        m.streamer = msg.sender;
        m.question = question;
        m.endTime = block.timestamp + durationSeconds;
        m.feeBps = feeBps;
        m.resolved = false;
        m.outcome = false;
        m.exists = true;

        emit MarketCreated(marketId, m.streamer, m.question, m.endTime, m.feeBps);
    }

    function getMarket(uint256 marketId)
        external
        view
        returns (
            address streamer,
            string memory question,
            uint256 endTime,
            bool resolved,
            bool outcome,
            uint256 yesPool,
            uint256 noPool,
            uint256 feeBps,
            uint256 yesCount,
            uint256 noCount,
            uint256 totalPool,
            bool isActive
        )
    {
        Market storage m = markets[marketId];
        require(m.exists, "no market");
        streamer = m.streamer;
        question = m.question;
        endTime = m.endTime;
        resolved = m.resolved;
        outcome = m.outcome;
        yesPool = m.yesPool;
        noPool = m.noPool;
        feeBps = m.feeBps;
        yesCount = m.yesCount;
        noCount = m.noCount;
        totalPool = m.yesPool + m.noPool;
        isActive = !m.resolved && block.timestamp < m.endTime;
    }

    function getUserStake(uint256 marketId, address user) external view returns (uint256 yesAmt, uint256 noAmt) {
        Market storage m = markets[marketId];
        require(m.exists, "no market");
        yesAmt = m.yes[user];
        noAmt = m.no[user];
    }

    function stake(uint256 marketId, bool outcomeYes) external payable {
        Market storage m = markets[marketId];
        require(m.exists, "no market");
        require(block.timestamp < m.endTime, "ended");
        require(!m.resolved, "resolved");
        require(msg.value > 0, "no value");

        if (outcomeYes) {
            if (!m.yesVoter[msg.sender]) { m.yesVoter[msg.sender] = true; m.yesCount += 1; }
            m.yes[msg.sender] += msg.value;
            m.yesPool += msg.value;
        } else {
            if (!m.noVoter[msg.sender]) { m.noVoter[msg.sender] = true; m.noCount += 1; }
            m.no[msg.sender] += msg.value;
            m.noPool += msg.value;
        }
        emit Voted(marketId, msg.sender, outcomeYes, msg.value);
    }

    function resolve(uint256 marketId, bool outcomeYes) external onlyStreamer(marketId) {
        Market storage m = markets[marketId];
        require(block.timestamp >= m.endTime, "not ended");
        require(!m.resolved, "already");
        m.resolved = true;
        m.outcome = outcomeYes;
        emit Resolved(marketId, outcomeYes);
    }

    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.exists && m.resolved, "not resolved");
        require(!m.claimed[msg.sender], "claimed");

        uint256 winnerStake = m.outcome ? m.yes[msg.sender] : m.no[msg.sender];
        require(winnerStake > 0, "no winnings");

        uint256 total = m.yesPool + m.noPool;
        uint256 fee = (total * m.feeBps) / 10_000;
        uint256 distributable = total - fee;
        uint256 winnerPool = m.outcome ? m.yesPool : m.noPool;
        require(winnerPool > 0, "no pool");

        uint256 payout = (distributable * winnerStake) / winnerPool;
        m.claimed[msg.sender] = true;
        if (m.outcome) { m.yes[msg.sender] = 0; } else { m.no[msg.sender] = 0; }
        (bool ok, ) = msg.sender.call{value: payout}("");
        require(ok, "transfer failed");
        emit Claimed(marketId, msg.sender, payout);
    }

    function claimStreamerFee(uint256 marketId) external onlyStreamer(marketId) {
        Market storage m = markets[marketId];
        require(m.resolved, "not resolved");
        uint256 total = m.yesPool + m.noPool;
        uint256 fee = (total * m.feeBps) / 10_000;
        uint256 toClaim = fee - m.streamerFeeClaimed;
        require(toClaim > 0, "nothing");
        m.streamerFeeClaimed += toClaim;
        (bool ok, ) = msg.sender.call{value: toClaim}("");
        require(ok, "transfer failed");
        emit StreamerFeeClaimed(marketId, msg.sender, toClaim);
    }
}
