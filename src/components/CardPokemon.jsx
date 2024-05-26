import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PokemonContext } from '../context/PokemonContext';
import addIcon from '../assets/add_icon.png';
import greenTick from '../assets/green_tick.png';

export const CardPokemon = ({ pokemon }) => {
    const { addPokemonToTeam, team } = useContext(PokemonContext);
    const [added, setAdded] = useState(false);
    const [alreadyInTeam, setAlreadyInTeam] = useState(false);

    const handleAddToTeam = () => {
        if (team.find(p => p.id === pokemon.id)) {
            setAlreadyInTeam(true);
            setTimeout(() => setAlreadyInTeam(false), 3000); 
        } else {
            addPokemonToTeam(pokemon);
            setAdded(true);
            setTimeout(() => setAdded(false), 1000); 
        }
    };

    return (
        <div className="card-pokemon">
            <Link to={`/pokemon/${pokemon.id}`}>
                <div className="card-img">
                    <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
                </div>
                <div className="card-info">
                    <span className='pokemon-id'>N° {pokemon.id}</span>
                    <h3>{pokemon.name}</h3>
                    <div className="card-types">
                        {pokemon.types.map(type => (
                            <span key={type.type.name} className={type.type.name}>
                                {type.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
            <img 
                src={added ? greenTick : addIcon} 
                alt="Add to team" 
                className="add-icon" 
                onClick={handleAddToTeam} 
            />
            {alreadyInTeam && <div className="alert">Este Pokémon ya está en tu equipo</div>}
        </div>
    );
};
