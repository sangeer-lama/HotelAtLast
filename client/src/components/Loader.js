import React, { useState } from 'react'
import BeatLoader from "react-spinners/BeatLoader";
function Loader() {

    let [loading] = useState(true);

    return (
        <div style={{marginTop:'150px'}}>
            <div className="sweet-loading text-center">

                <BeatLoader color='#000000' loading={loading} css='' size={30} />
            </div>
        </div>
    );
}

export default Loader