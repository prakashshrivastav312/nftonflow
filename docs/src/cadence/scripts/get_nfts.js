export const getNFTsScript = `
import Nu10NFT from 0xbfffa6d5a50e9adc
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&Nu10NFT.NFT] {
  let collection = getAccount(account).getCapability(/public/MyNFTCollection)
                    .borrow<&Nu10NFT.Collection{NonFungibleToken.CollectionPublic, Nu10NFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&Nu10NFT.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`