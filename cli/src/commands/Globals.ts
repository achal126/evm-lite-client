import * as Vorpal from "vorpal";
import {Account} from '../../../index';
import {updateToConfigFile} from "../evmlc";


export default function commandGlobals(evmlc: Vorpal, config) {
    return evmlc.command('globals ').alias('g')
        .description('set default global values')
        .option('-h, --host <host>', 'default host')
        .option('-p, --port <port>', 'default port')
        .option('--from <from>', 'default from')
        .option('--gas <gas>', 'default gas')
        .option('--gasprice <gasprice>', 'gas price')
        .option('--keystore <path>', 'keystore path')
        .option('--pwd <path>', 'password path')
        .types({
            string: ['h', 'host', 'from', 'keystore', 'pwd']
        })
        .action((args: Vorpal.Args): Promise<void> => {
            return new Promise<void>(resolve => {
                for (let prop in args.options) {
                    if (prop.toLowerCase() === 'host') {
                        config.connection.host = args.options[prop];
                        updateToConfigFile();
                    }
                    if (prop.toLowerCase() === 'port') {
                        config.connection.port = args.options[prop];
                        updateToConfigFile();
                    }
                }
                resolve();
            });
        });
};