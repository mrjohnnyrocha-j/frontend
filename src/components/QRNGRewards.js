// src/components/QRNGRewards.js

import React, { useState, useEffect } from 'react';
import { getQuantumRandomNumber } from '../services/quantum-rng';

const QRNGRewards = () => {
    const [randomNumber, setRandomNumber] = useState(0);
    const [rewardMessage, setRewardMessage] = useState('');

    useEffect(() => {
        const fetchRandomNumber = async () => {
            const qrng = await getQuantumRandomNumber();
            setRandomNumber(qrng);

            // Assign rewards based on random number
            if (qrng > 0.9) {
                setRewardMessage('You won a 50% discount on token purchases!');
            } else if (qrng > 0.5) {
                setRewardMessage('You won 10 free tokens!');
            } else {
                setRewardMessage('Better luck next time! Try again for rewards.');
            }
        };
        fetchRandomNumber();
    }, []);

    return (
        <div>
            <h2>QRNG-Based Reward</h2>
            <p>Quantum Random Number: {randomNumber}</p>
            <p>{rewardMessage}</p>
        </div>
    );
};

export default QRNGRewards;
