const PrintButton = () => {
    return <button
        onClick={() => window.print()}
        className="mt-8 bg-gray-800 text-white py-2 px-4 rounded-lg"
    >
        Print
    </button>
}


export default PrintButton;
