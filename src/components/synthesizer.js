import { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Synthesizer( { filteredApiData } ) {
    const [synth, setSynth] = useState({});
     
    const playSynth = () => {
        Tone.start();
        // Create a synth
        // Use the state updater callback form to set the synth state
        setSynth(() => {
            const newSynth = new Tone.Synth().toDestination();
            
            Tone.context.resume().then(() => {
                if (filteredApiData.length) {
                    newSynth.triggerAttackRelease("C4", "8n");
                }
            });

            return newSynth;
        });
    }

    useEffect(() => {
        // Use synth in an empty useEffect to prevent the "unused variable" warning
        console.log(synth);
    }, [synth]);

    return (
        <>
        <div>   
            <h1>Synthesizer</h1>
            <button onClick={playSynth}>Play C4</button>
        </div>
        </>
    );
}
