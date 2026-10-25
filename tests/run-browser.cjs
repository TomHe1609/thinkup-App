const {spawnSync}=require('node:child_process');
const path=require('node:path');
for(const name of ['learning-flow.cjs','study-flow.cjs','appearance-flow.cjs','release-flow.cjs','support-flow.cjs']){
 const run=spawnSync(process.execPath,[path.join(__dirname,name)],{stdio:'inherit',env:process.env});
 if(run.error){console.error(run.error.message);process.exit(1)}
 if(run.status!==0)process.exit(run.status||1);
}
