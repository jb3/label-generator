import { useState } from 'react';
import { ReactBarcode } from 'react-jsbarcode';


const LabelGenerator = () => {
    const hash = window.location.hash;
    const foundValue = hash ? hash.substring(1) : null;

    const [barcodeValue, setBarcodeValue] = useState<string | null>(foundValue ? decodeURIComponent(foundValue) : null);

    const todaysDate = new Date().toISOString().slice(0, 10);
    return <>
        <div className="mb-6">
            <label htmlFor="item-id" className="block text-lg font-medium text-gray-300 mb-2">
                Item ID
            </label>
            <input
                type="text"
                id="item-id"
                value={barcodeValue || ""}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    setBarcodeValue(e.target.value)
                    window.location.hash = e.target.value;
                }}
            />
        </div>
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Label Preview</h3>
            <div className="bg-white p-4 rounded justify-center flex">
                {
                    barcodeValue ?

                        <div className="flex flex-col" id="label">
                            <p className="text-gray-700">Date: {todaysDate}</p>
                            <ReactBarcode value={barcodeValue} />
                        </div>
                        :
                        <p className="text-gray-700">Enter an Item ID to get started</p>
                }
            </div>
        </div>
    </>;
};

export default LabelGenerator;
