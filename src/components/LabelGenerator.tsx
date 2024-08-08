import { useEffect, useState } from 'react';
import bwipjs from "bwip-js";

import barcodeTypes from '../utils/barcodeTypes';

interface HashOptions {
  bcid: string;
  text: string;
  extraOptions?: string;
}

const serializeHashConfig = (options: HashOptions) => {
  return `#${options.bcid}/${encodeURIComponent(options.text)}/${encodeURIComponent(options.extraOptions || "")}`;
}

const deserializeHashConfig = (hash: string): HashOptions | null => {
  const [bcid, text, extraOptions] = hash.substring(1).split("/");
  return { bcid, text: decodeURIComponent(text), extraOptions: decodeURIComponent(extraOptions) };
}

const LabelGenerator = () => {
  const hash = window.location.hash;
  const hashOptions = hash ? deserializeHashConfig(hash) : null;

  const [barcodeValue, setBarcodeValue] = useState<string | null>(hashOptions?.text || null);
  const [barcodeType, setBarcodeType] = useState<string>(hashOptions?.bcid || "code128");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [extraOpts, setExtraOpts] = useState<string>(hashOptions?.extraOptions || "");

  useEffect(() => {
    if (barcodeValue) {
      try {
        let parsedOpts = {};
        if (extraOpts) {
          parsedOpts = JSON.parse(extraOpts);
        }

        bwipjs.toCanvas("barcode", {
          bcid: barcodeType,
          text: barcodeValue,
          ...parsedOpts
        });
        setGenerationError(null);
      } catch (e: any) {
        setGenerationError(e.message);
      }
    }
  }, [barcodeValue, barcodeType, extraOpts]);

  const todaysDate = new Date().toISOString().slice(0, 10);
  return <>
    <div className="mb-6">
      <label htmlFor="barcode-text" className="block text-lg font-medium text-gray-300 mb-2">
        Barcode Text
      </label>
      <input
        type="text"
        id="barcode-text"
        value={barcodeValue || ""}
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          setBarcodeValue(e.target.value)
          window.location.hash = serializeHashConfig({ bcid: barcodeType, text: e.target.value, extraOptions: extraOpts });
        }}
      />
      <label htmlFor="barcode-type" className="block text-lg font-medium text-gray-300 mb-2 mt-4">
        Barcode Type
      </label>
      <select
        id="barcode-type"
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={barcodeType}
        onChange={(e) => {
          setBarcodeType(e.target.value); setGenerationError(null);
          window.location.hash = serializeHashConfig({ bcid: e.target.value, text: barcodeValue || "", extraOptions: extraOpts });
        }}
      >
        {Object.keys(barcodeTypes).map((key) => (
          <option key={key} value={key}>{barcodeTypes[key]}</option>
        ))}
      </select>
      <label htmlFor="extra-opts" className="block text-lg font-medium text-gray-300 mb-2 mt-4">
        Extra Options (JSON)
      </label>
      <textarea
        id="extra-opts"
        value={extraOpts}
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          setExtraOpts(e.target.value)
          window.location.hash = serializeHashConfig({ bcid: barcodeType, text: barcodeValue || "", extraOptions: e.target.value });
        }
        }
      />
      <p className="text-gray-400 text-sm mt-2">
        For more information on the options available, please refer to the{" "}
        <a
          href="https://github.com/bwipp/postscriptbarcode/wiki/Symbologies-Reference"
          className="text-blue-400"
          target="_blank"
          rel="noreferrer"
        >Symbologies Reference</a>
      </p>
    </div >
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Label Preview</h3>
      <div className="bg-white p-4 rounded justify-center flex flex-col items-center">
        {
          barcodeValue ?

            <div id="label" className="flex flex-col items-center">
              <p className="text-gray-700 font-mono">Date: {todaysDate}</p>
              <canvas id="barcode"></canvas>
              <p className="text-gray-700 mt-2 font-mono">{barcodeValue}</p>
            </div>
            :
            <p className="text-gray-700">Enter some content to get started</p>
        }
        {generationError ? <p className="text-red-400 mt-10 max-w-md text-center">{generationError}</p> : null}
      </div>
    </div>
  </>;
};

export default LabelGenerator;
