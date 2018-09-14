// Type definitions for evmlsdk 0.1.0
// Project: EVM Lite SDK
// Definitions by: Danu Kumanan <https://github.com/danu3006>

declare module 'evml' {

    interface BaseTX {
        gas?: number;
        gasPrice?: number;
    }

    interface TX extends BaseTX {
        from: string;
        to?: string;
        value?: number;
        data?: string;
    }

    interface ContractOptions extends BaseTX {
        from?: string;
        address?: string;
        data?: string;
        jsonInterface: ABI[];
    }

    interface Input {
        name: string;
        type: string;
    }

    interface ABI {
        constant?: any;
        inputs: Input[];
        name?: any;
        outputs?: any[];
        payable: any;
        stateMutability: any;
        type: any;
    }

    interface Account {
        address: string;
        balance: number;
        nonce: number;
    }

    interface TXReceipt {
        root: string;
        transactionHash: string;
        from: string;
        to?: string;
        gasUsed: number;
        cumulativeGasUsed: number;
        contractAddress: string;
        logs: [];
        logsBloom: string;
    }

    interface SolidityCompilerOutput {
        contracts: {};
        errors: string[];
        sourceList: string[];
        sources: {};
    }

    class EVMLiteClient {
        readonly host: string;
        readonly port: number;
        private _constructOptions;

        constructor(host: string, port: number);

        getAccount(address: string): Promise<String>;

        getAccounts(): Promise<string>;

        call(tx: string): Promise<{}>;

        sendTx(tx: string): Promise<{}>;

        sendRawTx(tx: string): Promise<{}>;

        getReceipt(txHash: string): Promise<{}>;
    }

    class Transaction {
        readonly controller: Controller;
        tx: TX;
        receipt: TXReceipt;
        readonly unpackfn: Function;
        readonly constant: boolean;

        /**
         * Transaction object to be sent or called.
         *
         * @param {TX} options The transaction options eg. gas, gas price, value...
         * @param {boolean} constant If the transaction is constant
         * @param {Function} unpackfn If constant - unpack function
         * @param {Controller} controller The controller class
         */
        constructor(options: TX, constant: boolean, unpackfn: Function, controller: Controller);

        /**
         * Send transaction.
         *
         * This function will mutate the state of the EVM.
         *
         * @param {Object} options
         */
        send(options: {
            to?: string;
            from?: string;
            value?: number;
            gas?: number;
            gasPrice?: any;
        }): any;

        /**
         * Call transaction.
         *
         * This function will not mutate the state of the EVM.
         *
         * @param {Object} options
         */
        call(options: {
            to?: string;
            from?: string;
            value?: number;
            gas?: number;
            gasPrice?: any;
        }): any;

        /**
         * Sets the from of the transaction.
         *
         * @param {string} from The from address
         * @returns {Transaction} The transaction
         */
        from(from: string): Transaction;

        /**
         * Sets the to of the transaction.
         *
         * @param {string} to The to address
         * @returns {Transaction} The transaction
         */
        to(to: string): Transaction;

        /**
         * Sets the value of the transaction.
         *
         * @param {number} value The value of tx
         * @returns {Transaction} The transaction
         */
        value(value: number): Transaction;

        /**
         * Sets the gas of the transaction.
         *
         * @param {number} gas The gas of tx
         * @returns {Transaction} The transaction
         */
        gas(gas: number): Transaction;

        /**
         * Sets the gas price of the transaction.
         *
         * @param {number} gasPrice The gas price of tx
         * @returns {Transaction} The transaction
         */
        gasPrice(gasPrice: number): Transaction;

        /**
         * Sets the data of the transaction.
         *
         * @param {number} data The data of tx
         * @returns {Transaction} The transaction
         */
        data(data: string): Transaction;
    }

    class SolidityContract {
        options: ContractOptions;
        readonly controller: Controller;
        methods: any;
        web3Contract: any;
        receipt: TXReceipt;

        /**
         * Attaches functions to contract.
         *
         * Parses function data from ABI and creates Javascript object representation then adds
         * these functions to Contract.methods.
         *
         * @private
         */
        private _attachMethodsToContract;

        /**
         * Encodes constructor parameters.
         *
         * @param {Array} params The parameters to encode
         * @private
         */
        private _encodeConstructorParams;

        /**
         * Javascript Object representation of a Solidity contract.
         *
         * Can either be used to deploy a contract or interact with a contract already deployed.
         *
         * @param {Controller} controller Controller Javascript object
         * @param {ContractOptions} options The options of the contract. eg. gas price, gas, address
         * @constructor
         */
        constructor(options: ContractOptions, controller: Controller);

        /**
         * Deploy contract to the blockchain.
         *
         * Deploys contract to the blockchain and sets the newly acquired address of the contract.
         * Also assigns the transaction receipt to this object..
         *
         * @param {Object} options The options for the contract. eg. constructor params, gas, gas price, data
         * @returns {SolidityContract} Returns deployed contract with receipt and address attributes
         */
        deploy(options?: {
            parameters?: any[];
            gas?: number;
            gasPrice?: any;
            data?: string;
        }): any;

        /**
         * Sets the address of the contract and populates Solidity functions.
         *
         * @param {string} address The address to assign to the contract
         * @returns {SolidityContract} The contract
         */
        setAddressAndPopulate(address: string): SolidityContract;

        /**
         * Sets the address of the contract.
         *
         * @param {string} address The address to assign to the contract
         * @returns {SolidityContract} The contract
         */
        address(address: string): SolidityContract;

        /**
         * Sets the default gas for the contract.
         *
         * Any functions from the this contract will inherit the `gas` value by default.
         * You still have the option to override the value once the transaction object is instantiated.
         *
         * @param {number} gas The gas to assign to the contract
         * @returns {SolidityContract} The contract
         */
        gas(gas: number): SolidityContract;

        /**
         * Sets the default gas price for the contract.
         *
         * Any functions from the this contract will inherit the `gasPrice` value by default.
         * You still have the option to override the value once the transaction object is instantiated.
         *
         * @param {number} gasPrice The gas price to assign to the contract
         * @returns {SolidityContract} The contract
         */
        gasPrice(gasPrice: number): SolidityContract;

        /**
         * Sets the data for deploying the contract.
         *
         * @param {string} data The data of the contract
         * @returns {SolidityContract} The contract
         */
        data(data: string): SolidityContract;

        /**
         * Sets the JSON Interface of the contract.
         *
         * @param {ABI[]} abis The JSON Interface of contract
         * @returns {SolidityContract} The contract
         */
        JSONInterface(abis: ABI[]): SolidityContract;
    }

    export class Controller {
        readonly host: string;
        readonly port: number;
        defaultAddress: string;
        accounts: Account[];
        readonly api: EVMLiteClient;

        /**
         * Creates a controller instance.
         *
         * This class controls all of functionality for interacting with an EVM-Lite node.
         *
         * @param {string} host The IP or alias of the EVM-Lite node
         * @param {number} port Port to access the service. default = 8080
         * @constructor
         */
        constructor(host: string, port?: number);

        /**
         * Generates Javascript object from Solidity Contract File.
         *
         * Takes a solidity file and generates corresponding functions associated with the contract
         * name provided. The byte-code of the contract is auto-assigned to the data option field
         * for the contract.
         *
         * @param {string} contractName Name of the Contract to get from Solidity file
         * @param {string} filePath Absolute or relative path of the Solidity file.
         * @returns {SolidityContract} A Javascript object representation of solidity contract
         */
        ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract;

        /**
         * Generates Contract Javascript object from Solidity Contract File.
         *
         * Takes ABI and generates corresponding functions associated with the contract provided.
         * The byte-code of the contract needs to be assigned before deploying. Mostly used to
         * interact with already deployed contracts.
         *
         * @param {ABI[]} abi The Application Binary Interface of the Solidity contract
         * @returns {SolidityContract} A Javascript object representation of solidity contract
         */
        ContractFromABI(abi: ABI[]): SolidityContract;

        /**
         * Transfer a specified value to the desired address.
         *
         * Sender address can be set after instantiating the Controller object (recommended) or
         * after the Transaction object has been created.
         *
         * @param {string} address The address of the receiver
         * @param {number} value The value to send the receiver
         * @returns {Transaction} the required Transaction object for transfer request
         */
        transfer(address: string, value: number): Transaction;

        /**
         * Require default from address to be set.
         *
         * @private
         */
        private _requireDefaultFromAddress(): void;
    }

    export class Utils {
        static fgRed: string;
        static fgGreen: string;
        static fgBlue: string;
        static fgMagenta: string;
        static fgCyan: string;
        static fgWhite: string;

        static log(color: string, text: string);
        static step(message: string);
        static explain(message: string);
        static space();
        static sleep(time: number);
    }

}
