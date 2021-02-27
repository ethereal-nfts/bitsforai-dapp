import React from 'react'
import { Section, Footer } from 'bloomer'

function FooterComponent(){
  return(
    <Footer className="has-text-centered" >
      <a href="https://discord.gg/mcqjqRv">Join the community on Discord</a>
      <br/>
      <a href="https://opensea.io/assets/bitsforai">Trade on OpenSea</a>
      <br/>
      <a href="https://etherscan.io/address/0xce5b23f11c486be7f8be4fac3b4ee6372d7ee91e">Review Contract on Etherscan</a>
    </Footer >
  )
}

export default FooterComponent
