/** @vitest-environment jsdom */
import {describe,it,expect} from 'vitest';
import {buy,sell,type Position} from './utils';
describe('operaciones simuladas',()=>{
 it('compra acciones y actualiza saldo y coste medio',()=>{const r=buy(1000,[],'inditex',2.5,40);expect(r.cash).toBe(900);expect(r.positions[0]).toEqual({stockId:'inditex',shares:2.5,costBasis:100});});
 it('vende una parte y conserva correctamente el coste de la posición',()=>{const start:Position[]=[{stockId:'inditex',shares:5,costBasis:250}];const r=sell(750,start,'inditex',2,60);expect(r.cash).toBe(870);expect(r.positions[0].shares).toBe(3);expect(r.positions[0].costBasis).toBe(150);expect(r.realized).toBe(20);});
 it('no permite comprar por encima del saldo',()=>expect(()=>buy(10,[],'inditex',1,11)).toThrow('saldo suficiente'));
 it('no permite vender más acciones de las disponibles',()=>expect(()=>sell(0,[{stockId:'inditex',shares:1,costBasis:20}],'inditex',2,20)).toThrow('tantas acciones'));
 it('permite vender toda la posición y elimina el lote restante',()=>{const r=sell(0,[{stockId:'inditex',shares:1,costBasis:20}],'inditex',1,22);expect(r.positions).toEqual([]);expect(r.cash).toBe(22);});
 it('rechaza cantidades negativas y cero',()=>{expect(()=>buy(100,[],'inditex',0,10)).toThrow();expect(()=>sell(0,[{stockId:'x',shares:2,costBasis:10}],'x',-1,10)).toThrow();});
 it('calcula rentabilidad desde el valor total de la cartera',()=>{const initial=1000,cash=700,positions=[{shares:5,price:70}];const portfolioValue=positions.reduce((sum,p)=>sum+p.shares*p.price,0);const total=cash+portfolioValue;expect((total-initial)/initial*100).toBe(5);});
 it('reinicia saldo, posiciones y transacciones al estado inicial',()=>{const reset={cash:1000,positions:[] as Position[],transactions:[]};expect(reset).toEqual({cash:1000,positions:[],transactions:[]});});
 it('persiste y recupera el estado en localStorage',()=>{const state={cash:750,positions:[{stockId:'bbva',shares:2,costBasis:30}],transactions:[{id:'1',side:'COMPRA',stockId:'bbva',shares:2,price:15,total:30}]};localStorage.setItem('simulador-bolsa-v1',JSON.stringify(state));expect(JSON.parse(localStorage.getItem('simulador-bolsa-v1')!).cash).toBe(750);});
});
