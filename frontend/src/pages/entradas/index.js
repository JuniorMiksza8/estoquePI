import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

import api from '../../api';
import Moment from 'moment';

import './styles.css';

export default function Entradas(){

  const [entradas,setEntradas] = useState([]);
  const [search,setSearch] = useState('');

   async function loadData(){
    const response = await api.get(`entrada`);
    console.log(response.data);
    setEntradas(response.data);
  }

  const filtrados = entradas.filter(entrada => entrada.id_produto.toLowerCase().includes(search.toLowerCase()));
  document.title = 'Entradas';
  useEffect(()=>{
    loadData();
  },[]);

  return (
    <>
      <header>
      <ul>
        <li>
          <Link to={{pathname : "/produtos"}} className="link back-button">
              <FiArrowLeft className="icon"/>
              <p>Voltar</p>
          </Link>
          </li>
      </ul>
      <ul>
        <li><p className="link page-title">Entradas</p></li>
      </ul>
      <ul>
        <p className="title">Total de registros : <strong>{filtrados.length}</strong> </p>
      </ul>
    </header>

    <input 
    type="text" 
    className="search"  
    placeholder="Procure a entrada pelo ID do produto" 
    value={search}
    onChange={(e)=>{setSearch(e.target.value)}}
    />

    <section>
      
    {filtrados.map((obj)=>(
              <div className="movimentacao" key={obj.id}>
                <p className="title">ID - {obj.id}</p>

                <p className="property">Produto:</p>
                <p className="value">{obj.nome} - {'#'+obj.id_produto}</p>

                <p className="property">Responsavel:</p>
                <p className="value">{obj.email}</p>

                <p className="property">Descrição:</p>
                <p className="descricao">{obj.descricao}</p>

                <p className="property">Quantidade:</p>
                <p className="value">{obj.quantidade}</p>     
                
                <p className="property">Feito em :</p>
                <p className="value">{Moment(obj.data).format('DD/MM/YYYY')}</p>
              </div>
            ))} 

    </section>    
    </>
  )
}