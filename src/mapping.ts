import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Contract,
  ApprovalForAll,
  OwnershipTransferred,
  SecondarySaleFees,
  SignerAdded,
  SignerRemoved,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/Contract/Contract"
import { Rarity,Transfer,Stats,Owner } from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAll): void {
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handleSecondarySaleFees(event: SecondarySaleFees): void {}

export function handleSignerAdded(event: SignerAdded): void {}

export function handleSignerRemoved(event: SignerRemoved): void {}

export function handleTransferBatch(event: TransferBatch): void {}

export function handleTransferSingle(event: TransferSingle): void {
  let rar=loadR(event.params._id)
  let oldo=loadO(event.params._from)
  let newo=loadO(event.params._to)
  let tr = Transfer.load(event.transaction.hash.toHex()+'-'+event.params._id.toString());
  if (tr == null) {
    tr = new Transfer(event.transaction.hash.toHex()+'-'+event.params._id.toString());
    let stats=loadS()
    stats.TranfersCount=stats.TranfersCount+BigInt.fromI32(1)
    stats.save()
  }
  tr.NewOwner=newo.id
  tr.PreviousOwner=oldo.id
  tr.Operator=event.params._operator
  tr.Rarity=rar.id
  tr.save()

  rar.Owner=newo.id

}

export function handleURI(event: URI): void {
  let rar=loadR(event.params._id)
  rar.Link=event.params._value
  rar.save()
}

export function loadR(tid: BigInt): Rarity {
  let rar = Rarity.load(tid.toString());
  if (rar == null) {
    rar = new Rarity(tid.toString());
    rar.save();
    let stats=loadS()
    stats.RaritiesCount=stats.RaritiesCount+BigInt.fromI32(1)
    stats.save()
  }

  return rar as Rarity;
}

export function loadO(address: Address): Owner {
  let owner = Owner.load(address.toHexString());
  if (owner == null) {
    owner = new Owner(address.toHexString());
    owner.save();
    let stats=loadS()
    stats.OwnersCount=stats.OwnersCount+BigInt.fromI32(1)
    stats.save()
  }
  return owner as Owner;
}

export function loadS(): Stats {
  let stats = Stats.load('0');
  if (stats == null) {
    stats = new Stats('0');
    stats.OwnersCount=BigInt.fromI32(0)
    stats.RaritiesCount=BigInt.fromI32(0)
    stats.TranfersCount=BigInt.fromI32(0)
    stats.save();
  }
  return stats as Stats;
}