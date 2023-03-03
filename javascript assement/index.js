const customer=["#", "NAME","DESCRIPTION","STATUS","RATE","BALANACE","DEPOSIT","ACTION"];
    
let table=document.querySelector("table");


 
window.addEventListener("load",(e)=>{
    document.getElementById("update").disabled=true;
    document.getElementById("update").className="disabled";
    generateTableHead(table,customer);
    getCustommerData("http://localhost:3000/customer/","load");
})


async function getCustommerData(url,loadData){
    try{

        let res=  await fetch(url);
        let data= await res.json();
      
        
        generateTableBody(data,loadData);
    }
    catch(error)
    {
        console.log(error)
    }    
}

function generateTableHead(table,data){
    let thead=table.createTHead();
   

    let row=thead.insertRow();
    for (const key of data) {
        let th=document.createElement('th');
        let text=document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);   
    }
}

function generateTableBody(data,loadData){
    console.log(data);
    var tbody=table.createTBody();
    if(loadData==='reload')
    { 
        table.childNodes[2].remove();    
    }
    if(loadData==="filter")
    {
        table.childNodes[2].remove(); 
      let newdata=  data.filter(item=>
          {
            if(item.status===JSON.parse(sessionStorage.getItem("data")) )
            {
                return item;
            }
            }
            )
            data=newdata;  
    }
        for (const item of data) 
        {
            let row=document.createElement("tr");
            tbody.appendChild(row);
            let cell=document.createElement("td");
            cell.className="id-style";
            let text1=document.createTextNode(item.id);
             cell.appendChild(text1);
              row.appendChild(cell);
             let cell2=document.createElement("td");
             cell2.className="name-style"; 
            let text2=document.createTextNode(item.name);
            cell2.appendChild(text2);  
            row.appendChild(cell2);
            let cell3=document.createElement("td");
            cell3.className="descrption-style"; 
            let text3=document.createTextNode(item.description);
            cell3.appendChild(text3); 
            row.appendChild(cell3);
            let cell4=document.createElement("td");
            cell4.className="status-style"; 
            let text4=document.createTextNode(item.status);
            if(item.status==="Open")
            {
                cell4.style.color="#4F5AED";
            //    /* cell4.style.background="#F0F1FA";
                

                
            }
            else if(item.status==="Error")
            {
                cell4.style.color="#D12953";
                cell4.style.background="#FAF0F3";
            }
            else if(item.status==="Success")
            {
                cell4.style.color="#14804A";
                 cell4.style.background="#E1FCEF";
            }
            else if(item.status==="Inactive")
        
            {
                cell4.style.color="#5A6376";
                cell4.style.background="#E9EDF5";
            }
            else{

            }
            cell4.appendChild(text4); 
            row.appendChild(cell4);
            let cell5=document.createElement("td");
            cell5.className="rate-style"; 
            let text5=document.createTextNode("$"+item.rate);
            cell5.appendChild(text5); 
            row.appendChild(cell5);
            let cell6=document.createElement("td");
            cell6.className="balance-style"; 
            let text6=document.createTextNode("-$"+item.balance);
            cell6.appendChild(text6); 
            row.appendChild(cell6);
            let cell7=document.createElement("td");
            cell7.className="deposit-style"; 
            let text7=document.createTextNode("$"+item.deposit);
            cell7.appendChild(text7); 
            row.appendChild(cell7);
            let cell8=document.createElement("td");
            cell8.className="button-style"; 
            var editbtn=document.createElement("button");
            editbtn.className="edit";
            let editbuttonText=document.createTextNode("edit");
            editbtn.appendChild(editbuttonText);
            cell8.appendChild(editbtn);
            row.appendChild(cell8);
            var deletebtn=document.createElement("button");
            deletebtn.className="delete";
            let deletebtntext=document.createTextNode("delete");
            deletebtn.appendChild(deletebtntext);
            cell8.appendChild(deletebtn);
            row.appendChild(cell8);
            editbtn.onclick=()=>editCustomer(item.id,item.name,item.description,item.status,item.rate,item.balance,item.deposit);
            deletebtn.onclick=()=>deleteCustomer(item.id);   
          
        }

    
} 

function editCustomer(id,name,description,status,rate,balance,deposit)
    {
        console.log("called");
        document.getElementById("name").value=name;
        document.getElementById("description").value=description;
        document.getElementById("status").value=status;
        document.getElementById("rate").value=rate;
        document.getElementById("balance").value=balance;
        document.getElementById("deposit").value=deposit;
        document.getElementById("save").disabled=true;
        document.getElementById("save").className="disabled";
        document.getElementById("update").disabled=false;
        document.getElementById("update").className="update-btn";
        
        fetch(`http://localhost:3000/customer/${id}`).then(respone=>respone.json()).then(data=>{sessionStorage.setItem("data2",JSON.stringify(data));}).catch(error=>console.log(error))
    }


    function deleteCustomer(id)
    {
        console.log(id);
        fetch(`http://localhost:3000/customer/${id}`, { method: 'DELETE' }).then(response=>response.json()).then(data=>
    {    
        console.log(data)
        alert("data deleted"); 
        getCustommerData("http://localhost:3000/customer/","reload");

    }
    ).catch(error=>console.log(error));

    } 

document.getElementById("save").addEventListener("click",()=>{

    let name=document.querySelector("#name").value ;
    let description=document.querySelector("#description").value ;
    let status=document.querySelector("#status").value ;
    let rate=document.querySelector("#rate").value ;
    let balance=document.querySelector("#balance").value ;
    let deposit=document.querySelector("#deposit").value ;
    
    
    if(name.length< 3 || name.length>25)
    {
        console.log("sucess");
        alert("name should be min 3 and max 25 characters")
    }
    else if(description.length<3 || description.length>150){
        console.log("erroe");
        alert("descrption should be min 3 and max 150 characters")
    }
    else if(status.length==0)
    {
        console.log("error");
       alert("select status");
    }
    else if(rate.length===0)
    {
        alert("enter rate");
    }
    else if(deposit.length===0)
    {  alert("enter deposit");

    }
    else if(balance.length===0)
    {
        alert("enter balance");
    }
    else{
        console.log("Inserted");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name:name,description:description,status:status,rate:rate,balance:balance,deposit:deposit})
        };
        fetch('http://localhost:3000/customer', requestOptions)
        .then(response => response.json())
        .then(data =>
             {    alert("data enter");
               
                
               
             getCustommerData("http://localhost:3000/customer/","reload");
               
            
            }).catch(error=>console.log(error));
     
    }
})

document.getElementById("cancel").addEventListener("click",()=>{
    document.querySelector("#name").value="" ;
    document.querySelector("#description").value="";
    document.querySelector("#status").value="";
    document.querySelector("#rate").value="" ;
    document.querySelector("#balance").value="" ;
    document.querySelector("#deposit").value="" ;
})

document.getElementById("status-filter").addEventListener("change",(e)=>{
    let data=e.target.value;

    if(data){
        sessionStorage.setItem("data",JSON.stringify(data))
        getCustommerData("http://localhost:3000/customer/","filter");
    }
    else{
        getCustommerData("http://localhost:3000/customer/","    load");
    }
    
});





document.getElementById("update").addEventListener("click",(e)=>{
    
    
    let name=document.querySelector("#name").value ;
    let description=document.querySelector("#description").value ;
    let status=document.querySelector("#status").value ;
    let rate=document.querySelector("#rate").value ;
    let balance=document.querySelector("#balance").value ;
    let deposit=document.querySelector("#deposit").value ;
   
    
    if(name.length< 3 || name.length>25)
    {
        console.log("sucess");
        alert("name should be min 3 and max 25 characters")
    }
    else if(description.length<3 || description.length>150){
        console.log("erroe");
        alert("descrption should be min 3 and max 150 characters")
    }
    else if(status.length==0)
    {
        console.log("error");
       alert("select status");
    }
    else if(rate.length===0)
    {
        alert("enter rate");
    }
    else if(deposit.length===0)
    {  alert("enter deposit");

    }
    else if(balance.length===0)
    {
        alert("enter balance");
    }
else{
    document.getElementById("save").disabled=false;
    document.getElementById("save").className="save";
   
    let datavalue=JSON.parse(sessionStorage.getItem("data2"));
    let {id}=datavalue;
   
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:  JSON.stringify({ name:name,description:description,status:status,rate:rate,balance:balance,deposit:deposit})
    };
    fetch(`http://localhost:3000/customer/${id}`, requestOptions)
    .then(response => response.json())
    .then(data => 
        {console.log(data);
            alert("data updated");
            getCustommerData("http://localhost:3000/customer/","reload");
           
        }).catch(error=>console.log(error));

        document.getElementById("update").disabled=true;
    document.getElementById("update").className="disabled";
}
});


const btn = document.getElementById('addCustomer');

btn.addEventListener('click', (e) => {
   
const form = document.querySelector("form");

console.log("hello");

  if (form.style.display === 'none') {
    
    form.style.display = 'block';
  } else {
    
    form.style.display = 'none ';
    
  }
// if (form.style.visibility === 'hidden') {
//     form.style.visibility = 'visible';
//   } else {
//     form.style.visibility = 'hidden';
//   }
});