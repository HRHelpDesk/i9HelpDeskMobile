import React, {useState} from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";
import { TextInput } from "react-native-paper";


export const DateInput = (props)=>{
    const [open, setOpen] = useState(false)

    return (
        <View>
             <TextInput
      onPressIn={()=>setOpen(true)}
      
        mode="outlined"
        value={props.value}
        
      />
      <DatePicker
      mode='date'
        modal
        open={open}
        date={props.date}
        onConfirm={props.onConfirm}
        onCancel={() => {
          setOpen(false)
        }}
      />
        </View>
    )
}