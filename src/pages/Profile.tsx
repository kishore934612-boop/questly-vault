import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CharacterAvatar from "@/components/CharacterAvatar";
import XPBar from "@/components/XPBar";
import { getPlayerData, CHARACTER_TYPES, getLevelTitle, STORAGE_KEYS, calculateXPForNextLevel, calculateCurrentLevelXP } from "@/lib/gameLogic";
import { toast } from "sonner";

export default function Profile() {
  const [player, setPlayer] = useState(getPlayerData());
  const [username, setUsername] = useState(player.username);

  const handleSaveUsername = () => {
    const updated = { ...player, username };
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(updated));
    setPlayer(updated);
    toast.success("Username updated!");
  };

  const handleChangeCharacter = (characterType: string) => {
    const updated = { ...player, characterType };
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(updated));
    setPlayer(updated);
    toast.success("Character changed!");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Player Profile</h1>
          <p className="text-muted-foreground">Customize your character and settings</p>
        </div>

        {/* Character Section */}
        <Card className="p-8 bg-gradient-card border-border shadow-card">
          <div className="flex flex-col items-center gap-6">
            <CharacterAvatar level={player.level} characterType={player.characterType} />
            <div className="text-center w-full max-w-md">
              <h2 className="text-2xl font-bold text-foreground">{player.username}</h2>
              <p className="text-lg text-primary font-semibold">{getLevelTitle(player.level)}</p>
              <p className="text-muted-foreground mt-2">Total XP: {player.totalXP}</p>
              <div className="mt-4">
                <XPBar 
                  currentXP={calculateCurrentLevelXP(player.totalXP, player.level)} 
                  maxXP={calculateXPForNextLevel(player.level)} 
                  level={player.level} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Username Settings */}
        <Card className="p-6 bg-gradient-card border-border shadow-card">
          <h3 className="text-xl font-semibold mb-4">Username</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Display Name</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-2"
              />
            </div>
            <Button onClick={handleSaveUsername} className="bg-primary hover:bg-primary/90">
              Save Username
            </Button>
          </div>
        </Card>

        {/* Character Selection */}
        <Card className="p-6 bg-gradient-card border-border shadow-card">
          <h3 className="text-xl font-semibold mb-4">Choose Your Character</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CHARACTER_TYPES.map((char) => (
              <button
                key={char.id}
                onClick={() => handleChangeCharacter(char.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  player.characterType === char.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-4xl mb-2">{char.emoji}</div>
                <div className="font-semibold">{char.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{char.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Member Since */}
        <Card className="p-6 bg-gradient-card border-border shadow-card">
          <h3 className="text-xl font-semibold mb-2">Member Since</h3>
          <p className="text-muted-foreground">
            {new Date(player.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </Card>
      </div>
    </Layout>
  );
}
