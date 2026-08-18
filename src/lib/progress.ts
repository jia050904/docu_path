import type {Procedure} from '../types/procedure';
import type {Checks} from './storage';

export type ProcedureProgress={procedure:Procedure;completedCount:number;totalCount:number;percent:number;complete:boolean;nextLabel:string;updatedAt:number};
const visible=<T extends {condition?:{questionId:string;values:string[]}}>(items:T[],answers:Record<string,string>)=>items.filter(item=>!item.condition||item.condition.values.includes(answers[item.condition.questionId]));

export function procedureProgress(procedure:Procedure,checks:Checks,stepChecks:Checks,answers:Record<string,string>={},updatedAt=0):ProcedureProgress{
  const documents=visible(procedure.requiredDocuments,answers);const steps=visible(procedure.steps,answers);
  const completedDocuments=(checks[procedure.id]||[]).filter(id=>documents.some(document=>document.id===id));
  const completedSteps=(stepChecks[procedure.id]||[]).filter(id=>steps.some(step=>step.id===id));
  const completedCount=completedDocuments.length+completedSteps.length;const totalCount=documents.length+steps.length;const percent=totalCount?Math.round(completedCount/totalCount*100):0;
  const nextDocument=documents.find(document=>!completedDocuments.includes(document.id));const nextStep=steps.find(step=>!completedSteps.includes(step.id));
  return {procedure,completedCount,totalCount,percent,complete:totalCount>0&&completedCount===totalCount,nextLabel:nextDocument?.name||nextStep?.title||'완료한 내용을 확인하세요',updatedAt};
}
