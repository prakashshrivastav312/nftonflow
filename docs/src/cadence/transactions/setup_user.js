export const setupUserTx = `
import Nu10NFT from 0xbfffa6d5a50e9adc
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace from 0xbfffa6d5a50e9adc

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- Nu10NFT.createEmptyCollection(), to: /storage/MyNFTCollection)
    acct.link<&Nu10NFT.Collection{Nu10NFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection, target: /storage/MyNFTCollection)
    acct.link<&Nu10NFT.Collection>(/private/MyNFTCollection, target: /storage/MyNFTCollection)
    
    let MyNFTCollection = acct.getCapability<&Nu10NFT.Collection>(/private/MyNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NFTMarketplace.createSaleCollection(MyNFTCollection: MyNFTCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`