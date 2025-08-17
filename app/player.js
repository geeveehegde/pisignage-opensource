const player = {
    updatePlayerStatus: (obj) => {
        console.log('Player status update:', obj);
    },
    
    secretAck: (socketId, hasError) => {
        console.log(`Secret acknowledgment for ${socketId}, error: ${hasError}`);
    },
    
    shellAck: (socketId, response) => {
        console.log(`Shell acknowledgment for ${socketId}:`, response);
    },
    
    piScreenShot: (socketId, response) => {
        console.log(`Screenshot for ${socketId}:`, response);
    },
    
    upload: (playerId, filename, data) => {
        console.log(`Upload for ${playerId}: ${filename}, size: ${data ? data.length : 0}`);
    }
};

export default player;