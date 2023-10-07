import { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Synthesizer( { filteredApiData, data } ) {
    const [synth, setSynth] = useState({});
     
    const playSynth = () => {
        Tone.start();
        // Create a synth
        // Use the state updater callback form to set the synth state
        setSynth(() => {
            const newSynth = new Tone.Synth().toDestination();
            const now = Tone.now();
            
            Tone.context.resume().then(() => {
                if (filteredApiData.length) {
                    newSynth.triggerAttackRelease("C4", "8n", now);
                    newSynth.triggerAttackRelease("E4", "8n", now + 0.5);
                }
            });

            return newSynth;
        });
    }

    useEffect(() => {
        // Use synth in an empty useEffect to prevent the "unused variable" warning
        console.log(synth);
        console.log(data);
    }, [data, synth]);

    return (
        <>
        <div>   
            <h1>Synthesizer</h1>
            <button onClick={playSynth}>Play C4</button>
        </div>
        </>
    );
}
