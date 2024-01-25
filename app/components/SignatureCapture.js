import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import { Button } from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';

const style = `.m-signature-pad--footer {display: none; margin: 0px;} 
    .m-signature-pad {
        position: absolute;
        font-size: 10px;
        width: 100%;
        height: 200
        top: 0;
        // left: 50%;
        // border: 1px solid #e8e8e8;
        background-color: transparent !important;
        // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
      }
      body {
        background-color: transparent !important;
      }`;


const SignatureCapture = ({ setData, Data, setScroll, signatureVar }, ) => {
  const signatureRef = useRef();
  const [signatureData, setSignatureData] = useState(null);
const [visible, setVisible] = useState(true)
  const clearSignature = () => {
    signatureRef.current.clearSignature();
    setVisible(true)
    setData((prevData) => ({
        ...prevData,
        [signatureVar]: '',
      }));
  };
  useEffect(()=>{console.log(Data)},[Data])

  const saveSignature = () => {
    let data = signatureRef.current.readSignature()
    console.log(data)
    // Check if signatureData is available before saving
    if (signatureData) {
        // console.log(signatureData)
      setData((prevData) => ({
        ...prevData,
        [signatureVar]: `data:image/png;base64,${signatureData}`,
      }));

      // Clear the signature and reset the state
      signatureRef.current.clearSignature();
      setSignatureData(null);
      
    }
  };

  const handleOK = (signature) => {
    setScroll(true)
    console.log(signature);
    setData((prevData) => ({
        ...prevData,
        [signatureVar]: `${signature}`,
      }));
      
      setSignatureData(signature);

  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  };
if(visible){
    return (<Button onPress={()=>{setVisible(false); setScroll(false) }} >Click here to sign</Button>)


} else {

  return (
    <View style={{ height: 200 }}>
         {Data[signatureVar]  && (
          <View style={{ height: 100,}}>
        <Image
          source={{ uri: Data[signatureVar] }}
          style={{ width: '100%', height: 100 }}
        />
        </View>
      
      )}
        <View style={{ height: 100, display: Data[signatureVar] !== '' ? 'none':'flex'}}>
      <SignatureScreen
        ref={signatureRef}
        onOK={handleOK} 
        bgHeight={100 }
        webStyle={style}
      />
      </View>
      

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
        <Button onPress={clearSignature}> Clear Signature</Button>
        <Button style={{display: Data[signatureVar] !== '' ? 'none':'flex'}} onPress={saveSignature} >Save Signature</Button>
      </View>

     
    </View>
  );
}
};

export default SignatureCapture;
