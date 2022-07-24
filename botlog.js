/** @format */
const { appendFileSync } = require( 'fs' );

class Logger
{
  /**
   * Logs given data in /logs/primarylog.log
   * @param data The data to log
   */
  static log ( data )
  {
    if ( data instanceof Buffer )
    {
      console.log( data.toString().trim() );
    } else console.log( data.trim() );
    Logger.#_appendLog( data, "primary" );
  }
  /**
   * Logs given errors in /logs/errorlog.log
   * @param error The error to log
   */
  static error ( error )
  {
    if ( error instanceof Buffer )
    {
      console.trace( error.toString().trim() );
    } else console.trace( error.trim() );
    Logger.#_appendLog( error, "error" );
  }
  static #_appendLog ( data, type )
  {
    appendFileSync(
      `${ process.cwd() }/logs/${ type }log.log`,
      `${ new Date() } ||> ${ data }`,
      {
        encoding: "utf8",
      }
    );
  }
}

module.exports = Logger
