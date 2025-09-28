# Streamer.fun
<br />  
<p align="center">  
  <a href="https://github.com/your_username/streamerchain">  
    <img src="images/logo.png" alt="Logo" width="100" height="100">  
  </a>  

  <h3 align="center">StreamerChain</h3>  

  <p align="center">  
    A multichain NFT marketplace and prediction platform for streamers, powered by Kadena’s scalable Proof of Work architecture.  
    <br />  
    <a href="https://github.com/your_username/streamerchain"><strong>Explore the docs »</strong></a>  
    <br />  
    <br />  
    <a href="https://github.com/your_username/streamerchain">View Demo</a>  
    ·  
    <a href="https://github.com/your_username/streamerchain/issues">Report Bug</a>  
    ·  
    <a href="https://github.com/your_username/streamerchain/issues">Request Feature</a>  
  </p>  
</p>  

---

## About the Project

Kadena has gone EVM — and **StreamerChain** is our multichain dApp built to showcase the power of Kadena’s **Chainweb architecture**.

**StreamerChain** is a decentralized platform where:

* Streamers mint and sell **time-bound NFTs**.
* Users trade assets in a **decentralized marketplace**.
* Communities participate in **Yes/No prediction markets**.
* **AI moderators** ensure safe and reliable interactions.

Unlike traditional single-chain dApps, StreamerChain runs across **five Kadena chains**, enabling seamless cross-chain transactions without compromising security or decentralization.

---

### Protocol Usage

#### Kadena

* Core blockchain layer handling contract deployments and multichain operations.
* Four contracts deployed across **5 Kadena chains**:

  1. **StreamerNFT** – mint and manage NFTs.
  2. **Marketplace** – decentralized asset trading.
  3. **Yes/No Contract (PlymarketContract)** – prediction market logic.
  4. **ModeratorContract** – governance and moderation.
* **Scaffold plugin** ensures smooth multi-chain interactions.

#### 0G & Hedera

* On **0G testnet**, we deployed a **RAG contract** and used its **storage system** to store moderator AI data.
* Due to limited testnet features, we integrated **Hedera** as an alternative AI backend, deploying contracts on the **Hedera testnet** for moderation features.

---

### Prize Fit

🔀 **Best Multichain Build on Chainweb**

* Demonstrates **Chainweb’s multichain power** with one dApp running across 5 Kadena chains.
* **Cross-chain consistency** via Scaffold plugin.
* Clear developer documentation and tooling.

🚀 **Most Innovative dApp or Integration**

* Unique mix of **streaming, NFTs, marketplaces, and prediction markets**.
* External integration with **Hedera AI moderation**.
* Optimized for **scaling and low-fee adoption** on Kadena.

🌐 **Best Institutional / RWA Use Case**

* **ModeratorContract** aligns with compliance-focused governance.
* Potential adoption by **streaming platforms** and digital communities.
* Resilient **enterprise-grade multi-chain architecture**.

---

### Built With

* [Kadena](https://kadena.io/) – Multichain PoW Layer 1
* [0G](https://0g.ai/) – RAG contract & decentralized storage
* [Hedera](https://hedera.com/) – AI moderation backend
* [React](https://reactjs.org/) – Frontend framework
* [Node.js](https://nodejs.org/) – Backend runtime
* [Express.js](https://expressjs.com/) – API server

---

## Getting Started

To set up the project locally, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/) v18+
* npm or yarn
* Git

Install npm if not available:

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/your_username/streamerchain.git
   ```
2. Navigate into the folder

   ```sh
   cd streamerchain
   ```
3. Install dependencies

   ```sh
   npm install
   ```
4. Configure environment variables in `.env` (API keys, Kadena chain settings, etc.)

---

## Usage

* Deploy contracts on Kadena using Hardhat + Scaffold.
* Deploy RAG contract on 0G testnet.
* Deploy moderator contracts on Hedera testnet.
* Run the frontend locally:

  ```sh
  npm run dev
  ```

---

## Roadmap

* [ ] Mainnet deployment on Kadena
* [ ] Native AI moderation via 0G production network
* [ ] DAO governance for ModeratorContract
* [ ] Streamer analytics & community features
* [ ] Mobile app support

See the [open issues](https://github.com/your_username/streamerchain/issues) for more.

---

## Contributing

Contributions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

**Your Name** – [@your_twitter](https://twitter.com/your_twitter) – [email@example.com](mailto:email@example.com)

Project Link: [https://github.com/your_username/streamerchain](https://github.com/your_username/streamerchain)

---

## Acknowledgements

* [Kadena Scaffold](https://kadena.io/)
* [0G AI](https://0g.ai/)
* [Hedera](https://hedera.com/)
* [GitHub Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet)
* [Img Shields](https://shields.io)

---

<!-- MARKDOWN LINKS & IMAGES -->  

[contributors-shield]: https://img.shields.io/github/contributors/your_username/streamerchain.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/streamerchain/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/streamerchain.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/streamerchain/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/streamerchain.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/streamerchain/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/streamerchain.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/streamerchain/issues
[license-shield]: https://img.shields.io/github/license/your_username/streamerchain.svg?style=for-the-badge
[license-url]: https://github.com/your_username/streamerchain/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your_username
[product-screenshot]: images/screenshot.png
