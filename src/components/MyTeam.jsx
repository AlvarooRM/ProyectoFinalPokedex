import React, { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../assets/icon.png';

const ItemType = 'POKEMON';

const PokemonCard = ({ pokemon, index, moveCard }) => {
    const navigate = useNavigate();

    const [, ref] = useDrop({
        accept: ItemType,
        hover: (item) => {
            if (item.index !== index) {
                moveCard(item.index, index);
                item.index = index;
            }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div
            ref={(node) => drag(ref(node))}
            className="team-card"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div onClick={() => navigate(`/pokemon/${pokemon.id}`)} style={{ cursor: 'pointer' }}>
                <span className="pokemon-name">{pokemon.name}</span>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <div className="pokemon-stats">
                    <p>HP: {pokemon.stats[0].base_stat}</p>
                    <p>ATK: {pokemon.stats[1].base_stat}</p>
                    <p>DEF: {pokemon.stats[2].base_stat}</p>
                </div>
            </div>
            <button className="remove-btn" onClick={() => moveCard(index, null)}>
                &times;
            </button>
            <div className="drag-handle">
                <img src={menuIcon} alt="Drag Icon" className="menu-icon" />
            </div>
        </div>
    );
};

export const MyTeam = () => {
    const { team, setTeam } = useContext(PokemonContext);

    const moveCard = (fromIndex, toIndex) => {
        const updatedTeam = [...team];
        const [movedCard] = updatedTeam.splice(fromIndex, 1);
        if (toIndex !== null) {
            updatedTeam.splice(toIndex, 0, movedCard);
        }
        setTeam(updatedTeam);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="team-container">
            <h1>Mi Equipo Pokémon</h1>
                <div className="team">
                    {team.map((pokemon, index) => (
                        <PokemonCard
                            key={pokemon.id}
                            index={index}
                            pokemon={pokemon}
                            moveCard={moveCard}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
};
