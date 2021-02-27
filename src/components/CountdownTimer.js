import React, { useEffect, useState } from 'react'
import {Title} from 'bloomer'

function toHHMMSS (sec_num)  {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}


function CountdownTimer({ endTime }){
  const [timeEpoch,setTimeEpoch] = useState()

  useEffect(()=>{
    setTimeout(()=>{
      let val = endTime-Math.floor(Date.now()/1000);
      if(val > 0){
        setTimeEpoch(val);
      }else{
        setTimeEpoch(0);
      }

    },1000)
  },[timeEpoch])

  return <Title style={{fontFamily: 'monospace'}}>{toHHMMSS(timeEpoch)}</Title>
}

export default CountdownTimer;
