import * as Vorpal from "vorpal";
import * as JSONBig from 'json-bigint';
import * as ASCIITable from 'ascii-table';

import Globals from "../utils/Globals";
import Session from "../classes/Session";

interface TXReceipt {
    root: string,
    transactionHash: string,
    from: string,
    to?: string,
    gasUsed: number,
    cumulativeGasUsed: number,
    contractAddress: string,
    logs: [],
    logsBloom: string,
    failed: boolean
}

export default function TransactionsList(evmlc: Vorpal, session: Session) {

    let description =
        'Lists all sent transactions.';

    return evmlc.command('transactions list').alias('t l')
        .description(description)
        .option('-f, --formatted', 'format output')
        .option('-v, --verbose', 'verbose output')
        .option('-h, --host <ip>', 'override config parameter host')
        .option('-p, --port <port>', 'override config parameter port')
        .types({
            string: ['h', 'host']
        })
        .action((args: Vorpal.Args): Promise<void> => {
            return new Promise<void>(async (resolve) => {
                try {
                    let connection = await session.connect(args.options.host, args.options.port);
                    let formatted = args.options.formatted || false;
                    let verbose = args.options.verbose || false;
                    let table = new ASCIITable();
                    let transactions = session.database.transactions.all();

                    if (formatted) {
                        if (transactions.length) {
                            if (verbose) {
                                table.setHeading('Date Time', 'Hash', 'From', 'To', 'Value', 'Gas', 'Gas Price', 'Status');
                                for (let tx of transactions) {
                                    let date = new Date(tx.date);
                                    let d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                                    let t = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                                    let receipt: TXReceipt = await connection.getReceipt(tx.txHash);
                                    table.addRow(`${d} ${t}`, tx.txHash, tx.from, tx.to, tx.value,tx.gas, tx.gasPrice,
                                        (receipt) ? ((!receipt.failed) ? 'Success' : 'Failed') : 'Failed');
                                }
                            } else {
                                table.setHeading('From', 'To', 'Value', 'Status');
                                for (let tx of transactions) {
                                    let receipt: TXReceipt = await connection.getReceipt(tx.txHash);
                                    table.addRow(tx.from, tx.to, tx.value,
                                        (receipt) ? ((!receipt.failed) ? 'Success' : 'Failed') : 'Failed');
                                }
                            }
                            Globals.success(table.toString());
                        } else {
                            Globals.warning('No transactions submitted.')
                        }
                    } else {
                        Globals.success(JSONBig.stringify(session.database.transactions.all()));
                    }
                } catch (err) {
                    (typeof err === 'object') ? console.log(err) : console.log(err);
                }
                resolve();
            });
        });

};