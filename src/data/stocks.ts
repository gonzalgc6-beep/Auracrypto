export type Stock = { id:string; name:string; ticker:string; sector:string; price:number; change:number; changePct:number; color:string; history:{date:string;price:number}[] };
const companyData = [
  {id:'repsol',name:'Repsol',ticker:'REP',sector:'Energía',price:14.82,change:.21,color:'#ee7d43',base:8.8,trend:.00028,vol:.035},
  {id:'santander',name:'Banco Santander',ticker:'SAN',sector:'Banca',price:7.16,change:-.08,color:'#e64e55',base:4.7,trend:.00032,vol:.04},
  {id:'bbva',name:'BBVA',ticker:'BBVA',sector:'Banca',price:16.24,change:.13,color:'#4386ed',base:6.1,trend:.00043,vol:.036},
  {id:'iberdrola',name:'Iberdrola',ticker:'IBE',sector:'Energía',price:15.31,change:.05,color:'#42a679',base:7.9,trend:.00037,vol:.022},
  {id:'inditex',name:'Inditex',ticker:'ITX',sector:'Consumo',price:48.72,change:.62,color:'#a07bd2',base:22,trend:.00048,vol:.03},
];
function series(base:number,end:number,trend:number,vol:number){const n=120;let prev=base;return Array.from({length:n},(_,i)=>{const t=i/(n-1);const wave=Math.sin(i*.22)*vol*.4+Math.sin(i*.067+1.3)*vol*.6;const raw=base*Math.exp(Math.log(end/base)*t+Math.sin(t*Math.PI)*wave*1.8);prev=raw;const d=new Date(2016,8,27);d.setDate(d.getDate()+Math.round(t*3652));return {date:d.toISOString().slice(0,10),price:i===n-1?end:Math.max(.5,prev)};});}
export const stocks:Stock[]=companyData.map(x=>({id:x.id,name:x.name,ticker:x.ticker,sector:x.sector,price:x.price,change:x.change,changePct:x.change/x.price*100,color:x.color,history:series(x.base,x.price,x.trend,x.vol)}));
