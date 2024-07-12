import './App.css';
import { useState, useEffect, useRef } from 'react';
import { PulseLoader } from 'react-spinners';
import { resources } from './Resources';

function App() {
  const [gameState, setGameState] = useState({
    gizmo: { count: 5, isCraftable: true, isVisible: true, isHandCrafting: false },
    bot: { count: 0, isCraftable: false, isVisible: false, isHandCrafting: false },
    droid: { count: 0, isCraftable: false, isVisible: false, isHandCrafting: false },
    logicalRobot: { count: 0, isCraftable: false, isVisible: false, isHandCrafting: false }
  });

  // so values dont refresh between renders
  const gameStateRef = useRef(gameState);

  // helper function for changing values in gameState
  const updateGameStateAttribute = (resourceName, attribute, value) => {
    setGameState(prevState => {
      const updatedState = {
        ...prevState,
        [resourceName]: {
          ...prevState[resourceName],
          [attribute]: value
        }
      };
      gameStateRef.current = updatedState;
      return updatedState;
    });
  };

  const checkVisibility = () => {
    resources.forEach(resource => {
      let allRequirementsMet = true;
      for (const [requiredResource, requiredCount] of Object.entries(resource.requirements)) {
        if (gameState[requiredResource].count < requiredCount) {
          if (gameState[resource.name].isCraftable) {
            updateGameStateAttribute(resource.name, 'isCraftable', false);
          }
          allRequirementsMet = false;
          break;
        }
      }
      if (allRequirementsMet && !gameState[resource.name].isVisible) {
        updateGameStateAttribute(resource.name, 'isVisible', true);
      }
      if (allRequirementsMet && !gameState[resource.name].isCraftable) {
        updateGameStateAttribute(resource.name, 'isCraftable', true);
      }
    });
  };

  useEffect(() => {
    checkVisibility();
  }, [gameState]);

  useEffect(() => {
    if (gameState['bot'].count > 0) {
      const interval = setInterval(() => {
        craftResource('gizmo', 1, false);
      }, (5000/ gameStateRef.current.bot.count));

      return () => clearInterval(interval);
    }
  }, [gameState.bot.count]);

  const subtractResourceCost = (resource) => {
    for (const [requiredResource, requiredCount] of Object.entries(resource.requirements)) {
      const currentCount = gameStateRef.current[requiredResource].count;
      updateGameStateAttribute(requiredResource, 'count', currentCount - requiredCount);
    }
  };

  const craftResource = (resourceName, amount, isByHand) => {
    const resource = resources.find(r => r.name === resourceName);
    if (isByHand) {
      updateGameStateAttribute(resourceName, 'isHandCrafting', true);
    }

    // instantly subtract resource
    subtractResourceCost(resource); 

    // add resource after a delay
    setTimeout(() => {
      const currentCount = gameStateRef.current[resourceName].count;
      const newCount = currentCount + amount;
      updateGameStateAttribute(resourceName, 'count', newCount);
      updateGameStateAttribute(resourceName, 'isHandCrafting', false);
    }, resource.timeToCraft);
  };

  return (
    <div className="App">
      <div className='crafting-zone'>
        {resources.map(resource => 
          gameState[resource.name].isVisible && (
          <div key={resource.name}>
            <p>{resource.displayName}: {gameState[resource.name].count} <span>{gameState[resource.name].isHandCrafting && <PulseLoader color='white' size={3} speedMultiplier={0.5} />}</span></p>
          </div>
          )
          
        )}
        
        {resources.map(resource => 
          gameState[resource.name].isVisible && (
          <div key={resource.name + '_button'}>
            <button 
              disabled={!gameState[resource.name].isCraftable || gameState[resource.name].isHandCrafting} 
              onClick={() => craftResource(resource.name, 1, true)}>
              Make a {resource.name.charAt(0).toUpperCase() + resource.name.slice(1)}
              {resource.name === 'bot' && <span> (5 gizmos)</span>}
            </button>
            {resource.name === 'bot' && <p>Bots are crafting {gameState['bot'].count * 12} gizmos per minute</p>}
          </div>
          
          )
        )}
        
      </div>
    </div>
  );
  
}

export default App;
