import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components';
import { PokemonContext } from '../context/PokemonContext';
import { primerMayuscula } from '../helper/helper';

export const PokemonPage = () => {
    const { getPokemonByID, addPokemonToTeam, team } = useContext(PokemonContext);

    const [loading, setLoading] = useState(true);
    const [pokemon, setPokemon] = useState({});
    const [alreadyInTeam, setAlreadyInTeam] = useState(false);

    const { id } = useParams();

    const fetchPokemon = async (id) => {
        const data = await getPokemonByID(id);
        setPokemon(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPokemon(id);
    }, [id]);

    const handleAddToTeam = () => {
        if (team.find(p => p.id === pokemon.id)) {
            setAlreadyInTeam(true);
            setTimeout(() => setAlreadyInTeam(false), 3000);
        } else {
            addPokemonToTeam(pokemon);
        }
    };

    const getProgressBarWidth = (stat) => {
        return `${(stat / 150) * 100}%`;
    };

    return (
        <main className='container main-pokemon'>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className='header-main-pokemon'>
                        <span className='number-pokemon'>#{pokemon.id}</span>
                        <div className='container-img-pokemon'>
                            <img
                                src={pokemon.sprites.other.dream_world.front_default}
                                alt={`Pokemon ${pokemon?.name}`}
                            />
                        </div>

                        <div className='container-info-pokemon'>
                            <h1>{primerMayuscula(pokemon.name)}</h1>
                            <div className='card-types info-pokemon-type'>
                                {pokemon.types.map(type => (
                                    <span key={type.type.name} className={`${type.type.name}`}>
                                        {type.type.name}
                                    </span>
                                ))}
                            </div>
                            <div className='info-pokemon'>
                                <div className='group-info'>
                                    <p>Altura</p>
                                    <span>{pokemon.height * 10}cm</span>
                                </div>
                                <div className='group-info'>
                                    <p>Peso</p>
                                    <span>{pokemon.weight / 10}KG</span>
                                </div>
                            </div>
                            <button className="btn-add-team" onClick={handleAddToTeam}>
                                Añadir a mi equipo
                            </button>
                            {alreadyInTeam && <div className="alert">Este Pokémon ya está en tu equipo</div>}
                        </div>
                    </div>

                    <div className='container-stats'>
                        <h1>Estadísticas</h1>
                        <div className='stats'>
                            {pokemon.stats.map((stat, index) => (
                                <div className='stat-group' key={index}>
                                    <span>{primerMayuscula(stat.stat.name)}</span>
                                    <div className='progress-bar-container'>
                                        <div
                                            className='progress-bar'
                                            style={{ width: getProgressBarWidth(stat.base_stat) }}
                                        ></div>
                                    </div>
                                    <span className='counter-stat'>{stat.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};
