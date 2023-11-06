import React from "react";

function ArrayPractise() {
  let v = [1, 10, 20, 0, 59, 63, 0, 88, 0];
  const d = v.sort((a, b) => a - b);
  let nums = [-1, 0, 3, 5, 9, 12];
    let dd = nums.indexOf(9)
  let ddd = nums.splice(0, 2);
  let check = nums.concat(ddd);

  let al = [1,3,5,4,9];
  let b = al.sort((a,b)=>a-b)
  let le = b.length-1
  const w = Array.from(Array(b[le]),(_,index)=>index+1);
  let f = w.filter(x=>!al.includes(x))
  console.log(f);




//   let as = [1,2,3,4,5]

//   let an = as.filter(x=> !al.includes(x))
//   console.log(an)
//   al.map((e,index)=>{

//     console.log(index+1)
//   })
 

  return (
    <div>
      <div style={{ display: "flex" }}>
        The array let v = [1, 10, 20, 0, 59, 63, 0, 88, 0]; will be sort in
        asending by sort as == &nbsp;
        {d.map((e,index) => {
          return <p key={index}>{e},</p>;
        })}
      </div>
      <p>
        find index of 9  nums = [-1, 0, 3, 5, 9, 12] == {dd}
      </p>
      <div style={{display:"flex"}}>
        Rmoeve 2 elements from array and add in last index.
        nums = [-1, 0, 3, 5, 9, 12] = {check.map((e,index)=>{
            return(
                <p key={index}>{e},</p>
            )
        })}
      </div>
    </div>
  );
}

export default ArrayPractise;
