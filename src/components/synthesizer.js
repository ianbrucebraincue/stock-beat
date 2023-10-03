import { useState } from 'react';
import * as Tone from 'tone';

export default function Synthesizer( { filteredApiData } ) {
    const [synth, setSynth] = useState("");
     
    const playSynth = () => {
        Tone.start();
        // Create a synth
        setSynth(new Tone.Synth().toDestination());
  
        Tone.context.resume().then(() => {
            if(filteredApiData.length) {
                synth.triggerAttackRelease("C4", "8n");
            }
        });
    }

    return (
        <>
        <div>   
            <h1>Synthesizer</h1>
            <button onClick={playSynth}>Play C4</button>
        </div>
        </>
    );
}
