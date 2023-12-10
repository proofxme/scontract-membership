import hre from "hardhat";
import { assert } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

// Fixture function for deploying the contract
async function deployFixture() {
  const [deployerWallet] = await hre.viem.getWalletClients();

  const myMembership = await hre.viem.deployContract("PoMembership", [deployerWallet.account.address]);

  return { myMembership };
}

describe("PoMembership deploy", function () {
  it("should deploy the contract with the proper owner", async function () {
    // Load the contract instance using the fixture function
    const { myMembership } = await loadFixture(deployFixture);

    const [deployerWallet] = await hre.viem.getWalletClients();

    // validate the owner
    const owner = await myMembership.read.owner();
    assert.equal(owner.toLowerCase(), deployerWallet.account.address.toLowerCase());
  });
  it("should have 0 minted memberships", async function () {
    // Load the contract instance using the fixture function
    const { myMembership } = await loadFixture(deployFixture);
  });

  it("should have the proper URI", async function () {
    // Load the contract instance using the fixture function
    const { myMembership } = await loadFixture(deployFixture);
    const [deployerWallet] = await hre.viem.getWalletClients();

    // set the id of the token as 0 and convert it to bigint
    const tokenId = BigInt(0);
    const quantity = BigInt(1);

    // mint a new token
    await myMembership.write.mint([deployerWallet.account.address, tokenId, quantity, "0x0"]);
    const uri = await myMembership.read.uri([tokenId]);
    assert.equal(uri, "https://api.pox.me/memberships/{id}.json");
  })
});