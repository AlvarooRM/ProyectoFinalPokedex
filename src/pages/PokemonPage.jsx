import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../components';
import { PokemonContext } from '../context/PokemonContext';
import { primerMayuscula } from '../helper/helper';

export const PokemonPage = () => {
    const { getPokemonByID, addPokemonToTeam, getSpeciesData, getEvolutionChain } = useContext(PokemonContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pokemon, setPokemon] = useState({});
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const { id } = useParams();

    const fetchPokemon = async (id) => {
        const data = await getPokemonByID(id);
        setPokemon(data);
        setLoading(false);
    };

    const fetchEvolutionChain = async (id) => {
        const speciesData = await getSpeciesData(id);
        const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
        const chain = extractEvolutionChain(evolutionData.chain);
        setEvolutionChain(chain);
    };

    const extractEvolutionChain = (chain) => {
        let evolutions = [];
        let current = chain;
        while (current) {
            evolutions.push({
                name: current.species.name,
                id: current.species.url.split('/').slice(-2, -1)[0], // Obtener el ID del URL
            });
            current = current.evolves_to[0];
        }
        return evolutions;
    };

    useEffect(() => {
        fetchPokemon(id);
        fetchEvolutionChain(id);
        loadComments(id);
    }, [id]);

    const getProgressBarWidth = (stat) => {
        return `${(stat / 150) * 100}%`;
    };

    const handleEvolutionClick = (evolutionId) => {
        navigate(`/pokemon/${evolutionId}`);
        window.scrollTo(0, 0); // Hacer scroll hacia arriba
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (comment.trim()) {
            const newComments = [...comments, comment];
            setComments(newComments);
            saveComments(id, newComments);
            setComment('');
        }
    };

    const handleCommentDelete = (index) => {
        const newComments = comments.filter((_, i) => i !== index);
        setComments(newComments);
        saveComments(id, newComments);
    };

    const saveComments = (pokemonId, comments) => {
        localStorage.setItem(`comments-${pokemonId}`, JSON.stringify(comments));
    };

    const loadComments = (pokemonId) => {
        const savedComments = localStorage.getItem(`comments-${pokemonId}`);
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        }
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
                            <button className="btn-add-team" onClick={() => addPokemonToTeam(pokemon)}>
                                Añadir a mi equipo
                            </button>
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

                    <div className='container-evolutions'>
                        <h2>Evoluciones</h2>
                        <div className='evolutions'>
                            {evolutionChain.map((evolution, index) => (
                                <div 
                                    key={index} 
                                    className='evolution'
                                    onClick={() => handleEvolutionClick(evolution.id)}
                                >
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                                        alt={evolution.name}
                                    />
                                    <p>{primerMayuscula(evolution.name)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='container-comments'>
                        <h2>Comentarios</h2>
                        <div className='comments-list'>
                            {comments.map((comment, index) => (
                                <div key={index} className='comment'>
                                    {comment}
                                    <button className='delete-comment' onClick={() => handleCommentDelete(index)}>X</button>
                                </div>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder='Escribe tu comentario...'
                            rows='3'
                        ></textarea>
                        <button className="btn-add-comment" onClick={handleCommentSubmit}>
                            Añadir Comentario
                        </button>
                    </div>
                </>
            )}
        </main>
    );
};
