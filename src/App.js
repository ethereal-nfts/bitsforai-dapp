import React, {useState, useEffect} from 'react'
import 'bulma'
import {Title, Subtitle, Button, Container, Section, Field, Input, Label, Control} from 'bloomer'
import CountdownTimer from './components/CountdownTimer'
import ArtistStatement from './components/ArtistStatement'
import Footer from './components/Footer'
import {ethers, utils} from 'ethers'
import abi from './bitsforai.json'

let contractAddress = '0xce5b23f11c486be7f8be4fac3b4ee6372d7ee91e';

let network = 'homestead'

    

function App() {

  const [currentBlockNumber, setCurrentBlockNumber] = useState()
  const [isEthereumEnabled, setIsEthereumEnabled] = useState(false)
  const [provider, setProvider] = useState(ethers.getDefaultProvider(network))
  const[account,setAccount] = useState()

  const [seed, setSeed] = useState()

  const[mintingEnd, setMintingEnd] = useState()
  const[mintfee, setMintfee] = useState(utils.parseEther('0.008'))
  const[jackpot, setJackpot] = useState(0)
  const[lastMinters,setLastMinters] = useState(['','','','','','','','','',''])

  const[sampleBits, setSampleBits] = useState();



  useEffect(()=>{
    function loadDataFromEth(){
      let contract = new ethers.Contract(contractAddress,abi,provider);
      contract.endTimer().then((val)=>{
        setMintingEnd(val.toNumber())
      })
      contract.getMintFee().then((val)=>{
        setMintfee(val);
      })
      contract.jackpot().then((val)=>{
        setJackpot(parseFloat(utils.formatEther(val)))
      })
      for(let i=0; i<10; i++){
        ((i)=>{
          contract.lastMinters(i).then((val)=>{
            let minters = lastMinters;
            minters[i] = val;
            setLastMinters(minters);
          })
        })(i)
      }
      /*if(typeof window.web3 !== 'undefined' && typeof window.web3.eth.accounts[0] !== 'undefined'){
        console.log('account',window.web3.eth.accounts[0]);
        setAccount(window.web3.eth.accounts[0].toLowerCase())
      }*/
    }
    loadDataFromEth();
    provider.on("block",(blockNumber)=>{
      setCurrentBlockNumber(blockNumber)
      loadDataFromEth()
    })
    return ()=>{
      provider.removeAllListeners('block');
    }
  },[provider,mintingEnd,mintfee,currentBlockNumber,jackpot,lastMinters,account])

  useEffect(()=>{
    if(!isEthereumEnabled)
      enableEthereum()
  },[isEthereumEnabled])

  useEffect(()=>{
    (async()=>{
      const offset = Math.floor(Math.random() * 1947);
      const res = await fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=${contractAddress}&order_direction=desc&offset=${offset}&limit=5`, {method: 'GET'})
      if(res.ok){
        const json = await res.json()
        console.log(json.assets)
        setSampleBits(json.assets)
      }
    })()
  },[])

  function enableEthereum(){
    if(typeof window.web3 !== 'undefined' || typeof window.ethereum !== 'undefined'){
      if(typeof window.ethereum !== 'undefined'){
        window.ethereum.enable().then(()=>{
          setIsEthereumEnabled(true)
          setProvider(new ethers.providers.Web3Provider(window.ethereum))
        })
      }else{
        setProvider(new ethers.providers.Web3Provider(window.web3.currentProvider))
        setIsEthereumEnabled(true)
      }
    }
  }

  function handleSeedInput(event){
    setSeed(parseInt(event.target.value))
  }

  function sendMintTx(){
    let contract = new ethers.Contract(contractAddress,abi,provider);
    let signer = provider.getSigner();
    let contractWithSigner = contract.connect(signer);
    contractWithSigner.mintBits(seed,{
      gasLimit:400000,
      value: mintfee
    }).then(()=>{
      console.log("mint success")
    })
  }

  function isAddressAccount(address){
    if(typeof account === 'undefined' || typeof address === 'undefined'){
      return false
    }
    return account == address.toLowerCase()
  }

  return (
    <Container className="App">
      <Section renderAs="header" className="has-text-centered">
        <Title >Bits For AI</Title >
        <Subtitle >16 bit NFTs for the AI art collectors of the future.</Subtitle>
      </Section>
      <Section className="has-text-centered">
        {sampleBits && (<div className="sampleBits">
          {
            sampleBits.map((asset,index)=>{
              return (<a href={asset.permalink} >
                <img src={asset.image_url} />
                <p>{asset.name}</p>
              </a>)
            })
          }
        </div>)}
        <Title isSize={3}>Minting is over!</Title>
        <Subtitle >2561 minted and 609 burned.</Subtitle>
        <p>You can still get your Bits (and please our future AI overlords) on <a href="https://opensea.io/assets/bitsforai">Open Sea</a>.</p>
        <p>Also, come join our <a href="https://discord.gg/mcqjqRv">Discord community</a> for prizes, contests, and future projects!</p>
      </Section>
      <ArtistStatement />
      <Footer />
    </Container>
  );
}

export default App;
