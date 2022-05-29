export const mintNFT = `
import Nu10NFT from 0xbfffa6d5a50e9adc

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&Nu10NFT.Collection>(from: /storage/MyNFTCollection)
                        ?? panic("This collection does not exist here")

    let nft <- Nu10NFT.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`