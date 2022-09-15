import React, { useState } from "react"; 
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import styles from '../styles/Home.module.css';
import InputGroup from 'react-bootstrap/InputGroup';


export default function FileDrop(props) {
     const [file, setFile] = useState();
     const [alert, setAlert] = useState("");

     const fileReader = new FileReader();
     const handleOnChange = (e) => {
        setFile(e.target.files[0]);
        setAlert("")
     };

     const handleOnSubmit = (e) => { e.preventDefault();
        if (file) {
            fileReader.onload = function(e) {
            var content = fileReader.result;

            //split csv file using "\n" for new line ( each row)

            var lines=content.split("\n");

            var result = [];

            var headers=lines[0].split(",");

            for(var i=1;i<lines.length-1;i++){
              var obj = {};
              var currentline=lines[i].split(",");
              for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
              }
              result.push(obj);
           }
      
           //return result; //JavaScript object
           try {
           sendToBackend(JSON.parse(JSON.stringify(result)), file.name.match(/\d+/)[0])
           } catch (e){
            console.log(e)
           }
        }
             fileReader.readAsText(file);
         }
     };

     const sendToBackend = async (csvjson, name) => {
        try {
            const res = await fetch('http://localhost:3001/report/addMany', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify(    {"date": "14/11/2023", "hours worked": 7.5, "employee id": 13, "job group ": "A"}),
                body: JSON.stringify( { title: name, properties: csvjson} )
            });
            // console.log(res);
            if (res.statusText === 'OK') {
                res.json().then(body => setAlert(body));
                props.getNumbers(true)
            }
            } catch (err) {
            console.log(err.message);
            }
        };


     return (
         <div style={{ textAlign: "center" }}>
             <Form>
                <InputGroup className="mb-3">
                    <Form.Control
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                    
                    />
                    <InputGroup.Text id="basic-addon2">.csv</InputGroup.Text>
                </InputGroup>

                {alert.length > 1?
                <h2>{alert}</h2>
                :
                <div></div>
                }

                 <Button className={styles.button} variant="primary"
                     onClick={(e) => {
                         handleOnSubmit(e);
                            }}
                        >
                     Send Report
                 </Button>
             </Form>
         </div>
     );
 }