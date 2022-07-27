import { assert, beforeAll, describe, newMockEvent, test, createMockedFunction} from "matchstick-as/assembly/index"
import { handleDeposit } from '../src/mappings/vault';
import { BigInt, ByteArray } from '@graphprotocol/graph-ts';
import { Address, ethereum, JSONValue, Value, ipfs, json, Bytes } from "@graphprotocol/graph-ts"

import {
	Factory,
	Vault,
	Deposit,
	Rebalance,
	Redeem,
	HarvestPerformanceFees,
	HarvestManagementFees,
} from "../src/types/schema";

import {
	Vault as VaultContract,
	Deposit as DepositEvent,
	Rebalance as RebalanceEvent,
	Redeem as RedeemEvent,
	HarvestManagementFees as HarvestManagementFeesEvent,
	HarvestPerformanceFees as HarvestPerformanceFeesEvent,
	AddAsset as AddAssetEvent,
} from '../src/types/Factory/Vault';
import { FACTORY_ADDRESS } from "../src/mappings/helpers";



/// to perform tests 
// need to mock transaction with the right contract address sending the event
// need to mock an event with the transaction
// need to mock the functions to call when handling an event
// need to initialiazed an some entities
// be careful with lower case
let defaultAddress = Address.fromString("0x0bfD814FC79319ac2FE8AcB576E493079EB061dD"); // from mockEvents

export function createDepositEvent(AmountIn : BigInt) : DepositEvent {

  let defaultAddress = Address.fromString("0x0bfD814FC79319ac2FE8AcB576E493079EB061dD"); // from mockEvents

    let newDepositEvent = changetype<DepositEvent>(newMockEvent())
    newDepositEvent.address = defaultAddress // mocking the source address of the event
    newDepositEvent.parameters = new Array()
    // event Deposit(uint256 baseTokenAmountIn, uint256 sharesMinted);
    let baseTokenAmountIn = new ethereum.EventParam("baseTokenAmountIn",ethereum.Value.fromSignedBigInt(AmountIn))
    let mintedShare = new ethereum.EventParam("sharesMinted",ethereum.Value.fromSignedBigInt(AmountIn))

    newDepositEvent.parameters.push(baseTokenAmountIn)
    newDepositEvent.parameters.push(mintedShare)
    newDepositEvent.address

    return newDepositEvent;
}


describe("Try ()", () => {

  beforeAll(() => {

    let factory = new Factory(FACTORY_ADDRESS)
    factory.vaultCount = 1
    let vault = new Vault(defaultAddress.toHexString())
    vault.factory = FACTORY_ADDRESS;
    vault.vault = defaultAddress
    vault.creator = new Bytes(0)
    vault.share = new Bytes(0)
    vault.tokens = [new Bytes(0)]
    vault.accManagementFeesToDAO = new BigInt(0)
    vault.accManagementFeesToStrategists = new BigInt(0)
    vault.accPerformanceFeesToDAO = new BigInt(0)
    vault.accPerformanceFeesToStrategists = new BigInt(0)
    vault.depositsCount = 0
    vault.rebalancesCount = 0
    vault.redemptionsCount = 0
  
    factory.vaults = [defaultAddress.toHexString()]
    factory.save()
    vault.save()
    assert.entityCount("Vault", 1)


    /// mocking functions

  createMockedFunction(defaultAddress, 'getVaultStatus', 'getVaultStatus():(uint256[],uint256,uint256)')
  .returns([ethereum.Value.fromArray([]),ethereum.Value.fromSignedBigInt(new BigInt(100000)), ethereum.Value.fromSignedBigInt(new BigInt(100000)), ethereum.Value.fromSignedBigInt(new BigInt(100000))])

  createMockedFunction(defaultAddress, 'tokensLength', 'tokensLength():(uint256)')
  .returns([ethereum.Value.fromSignedBigInt(new BigInt(4))])

  createMockedFunction(defaultAddress, 'getVaultBalances', 'getVaultBalances():(uint256[])')
  .returns([ethereum.Value.fromArray([])])

  createMockedFunction(defaultAddress, 'getManagementFees', 'getManagementFees():(uint256,uint256)')
  .returns([ethereum.Value.fromSignedBigInt(new BigInt(100000)), ethereum.Value.fromSignedBigInt(new BigInt(100000))])

  createMockedFunction(defaultAddress, 'getPerformanceFees', 'getPerformanceFees():(uint256,uint256)')
  .returns([ethereum.Value.fromSignedBigInt(new BigInt(100000)), ethereum.Value.fromSignedBigInt(new BigInt(100000))])

  })
  test("First test", () => {

    let depositEvent = createDepositEvent(new BigInt(100000000))
    handleDeposit(depositEvent)
    let vault = Vault.load(defaultAddress.toHexString());
    assert.fieldEquals("Vault", defaultAddress.toHexString(), "depositsCount", "1")
  })
})