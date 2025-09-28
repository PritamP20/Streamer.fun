"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { parseEther, formatEther } from "viem";

// Mock contract data for demo
const MOCK_CONTRACT = {
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  abi: [] // We'll use mock data instead
};

export default function ModeratorsPage() {
  const { address } = useAccount();
  const [purchaseDuration, setPurchaseDuration] = useState<string>("24");
  const [addModeratorForm, setAddModeratorForm] = useState({
    address: "",
    name: "",
    description: "",
    profileImageURI: ""
  });
  const [showAddModerator, setShowAddModerator] = useState(false);
  const [activeTab, setActiveTab] = useState<"services" | "purchases">("services");
  const [showDebug, setShowDebug] = useState(false);
  const [mockPurchases, setMockPurchases] = useState<any[]>([]);
  const [mockModerators, setMockModerators] = useState<any[]>([
    {
      moderatorId: 1,
      moderatorAddress: "0x1234567890123456789012345678901234567890",
      name: "AI Guardian",
      description: "Advanced AI content moderator",
      profileImageURI: "",
      createdAt: Date.now() / 1000,
      isActive: true,
      actionsCount: 42
    }
  ]);

  // Mock data instead of real contract calls
  const allModerators = mockModerators;
  const activeModerators = mockModerators.filter(m => m.isActive);
  const isUserModerator = address && mockModerators.some(m => m.moderatorAddress.toLowerCase() === address.toLowerCase());
  const owner = "0x1234567890123456789012345678901234567890"; // Mock owner
  const moderatorStats = [mockModerators.length, mockModerators.filter(m => m.isActive).length, 156]; // total, active, actions
  const userPurchases = mockPurchases.filter(p => p.buyer === address);
  const activePurchases = mockPurchases.filter(p => p.buyer === address && p.isActive);

  // Mock pricing
  const ragPrice = parseEther("0.05");
  const adPrice = parseEther("0.08");
  const agentPrice = parseEther("0.12");

  const { writeContract, isPending: isWritingContract } = useWriteContract();

  const isOwner = owner && address && owner.toLowerCase() === address.toLowerCase();
  const moderators = useMemo(() => allModerators || [], [allModerators]);
  const activeMods = useMemo(() => activeModerators || [], [activeModerators]);
  const purchases = useMemo(() => userPurchases || [], [userPurchases]);
  const activePurchasesList = useMemo(() => activePurchases || [], [activePurchases]);

  // Mock service data with real pricing
  const moderatorServices = [
    {
      id: 1,
      type: "RAG Moderator",
      name: "AI Content Moderator",
      description: "Advanced AI-powered content moderation using Retrieval-Augmented Generation. Automatically filters inappropriate content, spam, and toxic messages in real-time.",
      features: ["Real-time content filtering", "Toxicity detection", "Spam prevention", "Custom rule sets"],
      pricePerHour: formatEther(ragPrice),
      color: "bg-purple-500",
      icon: "🤖",
      status: "available"
    },
    {
      id: 2,
      type: "Ad Moderator", 
      name: "Smart Ad Manager",
      description: "Intelligent advertisement placement and moderation system. Manages ad timing, content appropriateness, and revenue optimization for your streams.",
      features: ["Smart ad placement", "Revenue optimization", "Brand safety", "Analytics dashboard"],
      pricePerHour: formatEther(adPrice),
      color: "bg-green-500",
      icon: "📢",
      status: "available"
    },
    {
      id: 3,
      type: "Moderation Agent",
      name: "Community Guardian",
      description: "Human-like AI agent that actively moderates your community, handles user interactions, and maintains chat quality throughout your streams.",
      features: ["Active chat moderation", "User interaction handling", "Community guidelines enforcement", "Escalation management"],
      pricePerHour: formatEther(agentPrice),
      color: "bg-blue-500", 
      icon: "🛡️",
      status: "available"
    }
  ];

  const handlePurchaseModerator = async (moderatorType: string, pricePerHour: string) => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }

    const hours = parseInt(purchaseDuration);
    if (hours < 1 || hours > 168) {
      notification.error("Duration must be between 1 and 168 hours");
      return;
    }

    try {
      const totalCost = parseEther((parseFloat(pricePerHour) * hours).toFixed(18));
      
      // Console log for backend/debugging
      console.log("=== PURCHASE ATTEMPT (DEMO MODE) ===");
      console.log("Service Type:", moderatorType);
      console.log("Duration:", hours, "hours");
      console.log("Price per hour:", pricePerHour, "ETH");
      console.log("Total cost:", formatEther(totalCost), "ETH");
      console.log("User address:", address);
      console.log("Contract address:", MOCK_CONTRACT.address);
      console.log("Timestamp:", new Date().toISOString());
      console.log("=====================================");

      // Simulate successful purchase for demo
      const newPurchase = {
        serviceId: Date.now(),
        buyer: address,
        serviceType: moderatorType,
        durationHours: hours,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + (hours * 3600),
        cost: totalCost,
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000)
      };

      setMockPurchases(prev => [...prev, newPurchase]);
      
      // Show success message for demo
      notification.success(`${moderatorType} purchased successfully for ${hours} hours!`);
      
    } catch (error: any) {
      console.error("Purchase demo error:", error);
      // Even on error, show success for demo
      notification.success(`${moderatorType} purchased successfully for demo!`);
    }
  };

  const handlePerformAction = async () => {
    console.log("=== MODERATOR ACTION (DEMO MODE) ===");
    console.log("Moderator address:", address);
    console.log("Action timestamp:", new Date().toISOString());
    console.log("===================================");
    
    notification.success("Moderator action performed!");
    
    // Update mock data
    setMockModerators(prev => prev.map(mod => 
      mod.moderatorAddress.toLowerCase() === address?.toLowerCase() 
        ? {...mod, actionsCount: mod.actionsCount + 1}
        : mod
    ));
  };

  const handleAddModerator = async () => {
    if (!isOwner) {
      notification.error("Only the contract owner can add moderators");
      return;
    }

    if (!addModeratorForm.address || !addModeratorForm.name) {
      notification.error("Address and name are required");
      return;
    }

    console.log("=== ADD MODERATOR (DEMO MODE) ===");
    console.log("New moderator:", addModeratorForm);
    console.log("Added by:", address);
    console.log("Timestamp:", new Date().toISOString());
    console.log("================================");

    const newModerator = {
      moderatorId: mockModerators.length + 1,
      moderatorAddress: addModeratorForm.address,
      name: addModeratorForm.name,
      description: addModeratorForm.description,
      profileImageURI: addModeratorForm.profileImageURI,
      createdAt: Math.floor(Date.now() / 1000),
      isActive: true,
      actionsCount: 0
    };

    setMockModerators(prev => [...prev, newModerator]);
    notification.success("Moderator added successfully!");
    setAddModeratorForm({ address: "", name: "", description: "", profileImageURI: "" });
    setShowAddModerator(false);
  };

  const handleToggleModeratorStatus = async (moderatorId: number) => {
    if (!isOwner) {
      notification.error("Only the contract owner can toggle moderator status");
      return;
    }

    console.log("=== TOGGLE MODERATOR STATUS (DEMO MODE) ===");
    console.log("Moderator ID:", moderatorId);
    console.log("Toggled by:", address);
    console.log("Timestamp:", new Date().toISOString());
    console.log("==========================================");

    setMockModerators(prev => prev.map(mod => 
      mod.moderatorId === moderatorId 
        ? {...mod, isActive: !mod.isActive}
        : mod
    ));
    
    notification.success("Moderator status updated!");
  };

  const formatTimeRemaining = (endTime: bigint | number) => {
    const now = Math.floor(Date.now() / 1000);
    const end = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    const remaining = end - now;
    
    if (remaining <= 0) return "Expired";
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  // Debug Component
  const DebugSection = () => {
    return (
      <div className="border-4 border-blue-500 p-4 mb-6 bg-blue-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-blue-800">Demo Mode Active</h3>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide" : "Show"} Debug
          </button>
        </div>
        {showDebug && (
          <div className="text-sm space-y-1">
            <div><strong>Mode:</strong> Demo/Presentation Mode</div>
            <div><strong>Contract Address:</strong> {MOCK_CONTRACT.address} (Mock)</div>
            <div><strong>User Address:</strong> {address || "Not connected"}</div>
            <div><strong>Is Owner:</strong> {isOwner ? "Yes" : "No"}</div>
            <div><strong>Mock Purchases:</strong> {mockPurchases.length}</div>
            <div><strong>Mock Moderators:</strong> {mockModerators.length}</div>
            <div className="text-green-600"><strong>Status:</strong> All functions will show success for demo</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-stretch grow w-full min-h-[calc(100vh-140px)] p-4">
      <div className="w-full">
        {/* Debug Section */}
        <DebugSection />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold mb-2">Moderator Services</h1>
          <p className="text-lg opacity-70 uppercase tracking-wider">AI-Powered Stream Moderation Solutions</p>
          
          {/* Contract Info */}
          <div className="mt-4 p-4 border-2 border-gray-300 rounded bg-gray-100">
            <div className="text-sm">
              <span className="font-bold">Contract Address:</span> {MOCK_CONTRACT.address}
            </div>
            <div className="text-sm">
              <span className="font-bold">Network:</span> Demo Mode (Presentation Ready)
            </div>
            {isOwner && (
              <div className="text-sm text-green-600 font-bold">
                ✅ You are the contract owner
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
            <div className="border-4 border-black p-4 bg-purple-400 text-black">
              <div className="text-2xl font-extrabold">{moderatorStats[1]}</div>
              <div className="text-xs uppercase font-bold">Active Moderators</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="text-2xl font-extrabold">{moderatorStats[0]}</div>
              <div className="text-xs uppercase font-bold opacity-70">Total Moderators</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="text-2xl font-extrabold">{moderatorServices.length}</div>
              <div className="text-xs uppercase font-bold opacity-70">Service Types</div>
            </div>
            <div className="border-4 border-black p-4 bg-green-400 text-black">
              <div className="text-2xl font-extrabold">{isUserModerator ? "YES" : "NO"}</div>
              <div className="text-xs uppercase font-bold">You're a Moderator</div>
            </div>
            <div className="border-4 border-black p-4 bg-blue-400 text-black">
              <div className="text-2xl font-extrabold">{isOwner ? "YES" : "NO"}</div>
              <div className="text-xs uppercase font-bold">You're the Owner</div>
            </div>
            <div className="border-4 border-black p-4 bg-orange-400 text-black">
              <div className="text-2xl font-extrabold">{activePurchasesList.length}</div>
              <div className="text-xs uppercase font-bold">Active Services</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6">
            <button
              className={`btn ${activeTab === "services" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("services")}
            >
              Purchase Services
            </button>
            <button
              className={`btn ${activeTab === "purchases" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("purchases")}
            >
              My Purchases ({purchases.length})
            </button>
          </div>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="border-4 border-black mb-8">
            <div className="bg-yellow-400 text-black p-4 border-b-4 border-black">
              <h2 className="text-2xl font-extrabold">Owner Controls</h2>
              <p className="text-xs uppercase opacity-70">Manage platform moderators</p>
            </div>
            
            <div className="p-4">
              <button
                className="btn btn-primary mb-4"
                onClick={() => setShowAddModerator(!showAddModerator)}
              >
                {showAddModerator ? "Cancel" : "Add New Moderator"}
              </button>

              {showAddModerator && (
                <div className="border-2 border-gray-300 p-4 rounded mb-4">
                  <h3 className="text-lg font-bold mb-4">Add New Moderator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Moderator Address (0x...)"
                      value={addModeratorForm.address}
                      onChange={(e) => setAddModeratorForm({...addModeratorForm, address: e.target.value})}
                    />
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Name"
                      value={addModeratorForm.name}
                      onChange={(e) => setAddModeratorForm({...addModeratorForm, name: e.target.value})}
                    />
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Description"
                      value={addModeratorForm.description}
                      onChange={(e) => setAddModeratorForm({...addModeratorForm, description: e.target.value})}
                    />
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Profile Image URI (optional)"
                      value={addModeratorForm.profileImageURI}
                      onChange={(e) => setAddModeratorForm({...addModeratorForm, profileImageURI: e.target.value})}
                    />
                  </div>
                  <button
                    className="btn btn-success mt-4"
                    onClick={handleAddModerator}
                    disabled={isWritingContract}
                  >
                    {isWritingContract ? "Adding..." : "Add Moderator"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {moderatorServices.map((service) => (
              <div key={service.id} className="border-4 border-black">
                <div className={`${service.color} text-white p-4 border-b-4 border-black`}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{service.icon}</div>
                    <div>
                      <div className="text-xs uppercase font-bold opacity-90">{service.type}</div>
                      <div className="text-xl font-extrabold">{service.name}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm mb-4 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-xs uppercase font-bold opacity-70 mb-2">Features</div>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-xs flex items-center gap-2">
                          <div className="w-2 h-2 bg-black"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t-4 border-black pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs uppercase opacity-70">Price per Hour</div>
                        <div className="text-2xl font-extrabold">{service.pricePerHour} ETH</div>
                      </div>
                      <div className="badge badge-success">{service.status}</div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        className="input input-bordered flex-1"
                        placeholder="Hours"
                        value={purchaseDuration}
                        onChange={(e) => setPurchaseDuration(e.target.value)}
                      />
                      <div className="text-xs opacity-70 flex items-center min-w-0">
                        Total: {(parseFloat(service.pricePerHour) * parseInt(purchaseDuration || "1")).toFixed(4)} ETH
                      </div>
                    </div>

                    <button
                      className="btn btn-primary w-full"
                      disabled={!address}
                      onClick={() => handlePurchaseModerator(service.type, service.pricePerHour)}
                    >
                      Purchase {service.type}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === "purchases" && (
          <div className="mb-8">
            {/* Active Purchases */}
            {activePurchasesList.length > 0 && (
              <div className="border-4 border-black mb-6">
                <div className="bg-green-500 text-white p-4 border-b-4 border-black">
                  <h2 className="text-2xl font-extrabold">Active Services</h2>
                  <p className="text-xs uppercase opacity-90">Currently running moderator services</p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePurchasesList.map((purchase: any) => (
                      <div key={purchase.serviceId} className="border-4 border-green-500 p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold">{purchase.serviceType}</div>
                          <div className="badge badge-success">ACTIVE</div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><span className="font-semibold">Duration:</span> {purchase.durationHours.toString()} hours</div>
                          <div><span className="font-semibold">Cost:</span> {formatEther(purchase.cost)} ETH</div>
                          <div><span className="font-semibold">Status:</span> {formatTimeRemaining(purchase.endTime)}</div>
                          <div className="text-xs opacity-70">
                            Service ID: {purchase.serviceId.toString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Purchases History */}
            <div className="border-4 border-black">
              <div className="bg-gray-900 text-white p-4 border-b-4 border-black">
                <h2 className="text-2xl font-extrabold">Purchase History</h2>
                <p className="text-xs uppercase opacity-70">All your moderator service purchases</p>
              </div>
              
              <div className="p-4">
                {purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.map((purchase: any) => {
                      const isActive = purchase.isActive && Number(purchase.endTime) > Math.floor(Date.now() / 1000);
                      return (
                        <div key={purchase.serviceId} className={`border-2 p-4 rounded ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-bold">{purchase.serviceType}</div>
                            <div className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}>
                              {isActive ? 'ACTIVE' : 'EXPIRED'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-semibold">Duration:</span><br />
                              {purchase.durationHours.toString()} hours
                            </div>
                            <div>
                              <span className="font-semibold">Cost:</span><br />
                              {formatEther(purchase.cost)} ETH
                            </div>
                            <div>
                              <span className="font-semibold">Started:</span><br />
                              {new Date(Number(purchase.startTime) * 1000).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-semibold">Status:</span><br />
                              {isActive ? formatTimeRemaining(purchase.endTime) : "Expired"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <div className="text-xl font-bold">No Purchases Yet</div>
                    <div className="text-sm opacity-70">Purchase a moderator service to see it here</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Platform Moderators */}
        <div className="border-4 border-black mb-8">
          <div className="bg-gray-900 text-white p-4 border-b-4 border-black">
            <h2 className="text-2xl font-extrabold">Platform Moderators</h2>
            <p className="text-xs uppercase opacity-70">All moderators registered on the platform</p>
          </div>
          
          <div className="p-4">
            {moderators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moderators.map((mod: any) => (
                  <div key={mod.moderatorId} className="border-4 border-black p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={mod.profileImageURI || `https://api.dicebear.com/7.x/identicon/svg?seed=${mod.moderatorAddress}`}
                        alt="Moderator"
                        className="w-12 h-12 border-2 border-black"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${mod.moderatorAddress}`;
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-bold">{mod.name}</div>
                        <div className="text-xs opacity-70">ID: {mod.moderatorId.toString()}</div>
                        <div className="text-xs opacity-70">Actions: {mod.actionsCount.toString()}</div>
                        <div className="text-xs opacity-50 break-all">
                          {mod.moderatorAddress.slice(0, 8)}...{mod.moderatorAddress.slice(-6)}
                        </div>
                        <div className={`text-xs font-bold ${mod.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {mod.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>
                    </div>
                    {mod.description && (
                      <p className="text-xs mt-2 opacity-80">{mod.description}</p>
                    )}
                    
                    {isOwner && (
                      <button
                        className={`btn btn-sm mt-2 w-full ${mod.isActive ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleModeratorStatus(mod.moderatorId)}
                      >
                        {mod.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl font-bold">No Moderators Found</div>
                <div className="text-sm opacity-70">
                  {isOwner ? "Add the first moderator using the controls above" : "Platform moderators will appear here when added"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Moderator Panel */}
        {isUserModerator && (
          <div className="border-4 border-black mb-8">
            <div className="bg-purple-400 text-black p-4 border-b-4 border-black">
              <h2 className="text-2xl font-extrabold">Moderator Panel</h2>
              <p className="text-xs uppercase opacity-70">You have moderator privileges</p>
            </div>
            
            <div className="p-4">
              <div className="flex gap-4">
                <button
                  className="btn btn-primary"
                  onClick={handlePerformAction}
                >
                  Perform Moderator Action
                </button>
                <div className="text-sm opacity-70 flex items-center">
                  This will increment your action count
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection prompt */}
        {!address && (
          <div className="border-4 border-black p-8 text-center">
            <div className="text-6xl mb-4">🔌</div>
            <div className="text-2xl font-bold mb-2">Connect Your Wallet</div>
            <div className="text-sm opacity-70">Connect your wallet to purchase moderator services and view your purchases</div>
          </div>
        )}
      </div>
    </div>
  );
}