import React, { useEffect, useState, ChangeEvent } from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api'
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import './style.css';
import logo from '../../assets/logo.svg';

interface Item{
  id: number;
  title: string;
  item_url: string;
};

interface IbgeUfresponse {
  sigla: string;
};

interface IbgeCityResponse {
  nome: string;
};


const CreatePoint = () => {
  const [items, setitems] = useState<Item[]>([]);
  const [ufs, setUf] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0 ,0]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0 ,0]);

  useEffect( () => {
    api.get('items').then(response =>{
      setitems(response.data);
    });
  }, []);  

  useEffect( () => {
    axios.get<IbgeUfresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
     .then(response => {
        const ufinitials = response.data.map(uf => uf.sigla);
        
        setUf(ufinitials);
     });
  });

  useEffect( () => {
    if (selectedUf === '0'){
      return;
    };

    axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
     .then(response => {
         const cityNames = response.data.map(city => city.nome);
        
         setCities( cityNames );
     });

  }, [selectedUf]);

  useEffect( () =>{
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  })

  function handleSelectUf( event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    
    setSelectedUf(uf);
  };

  function handleSelectCity( event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    
    setSelectedCity(city);
  };

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>       
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>                      
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>     

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>     

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                { ufs.map( uf => (
                    <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma Cidade</option>
                { cities.map((city, index ) => (
                  <option key={index} value={city}>{city}</option>
                ))};
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>    

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
                <img src={item.item_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
            

          </ul>      
        </fieldset>      

        <button type="submit">Cadastar</button>
      </form>
    </div>
  );
}

export default CreatePoint;