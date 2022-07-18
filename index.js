/** @format */

const fs = require( "fs" );
const path = require( "path" );
const childProcesses = require( "node:child_process" );
const Logger = require( "./botlog" );

const spawnBot = ( code, startup ) =>
{
  if ( !startup )
  {
    if ( code )
      Logger.error( `Process had closed with code: ${ code }. Restarting now.` );
    else Logger.error( `Process had closed. Restarting now.` );
  }
  return childProcesses.fork(
    "./clientstart",
    [ startup ? process.argv[ 2 ] ?? `` : `` ],
    {
      stdio: "pipe",
    }
  );
};

( async () =>
{

  console.log( "Starting bot..." );
  const mainBotProcess = spawnBot( null, true );

  mainBotProcess.stdout?.on( "data", Logger.log );
  mainBotProcess.stderr?.on( "data", Logger.error );
  mainBotProcess.on( "close", spawnBot );
} )();
