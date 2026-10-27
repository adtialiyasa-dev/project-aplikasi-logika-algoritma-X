/**
 * Simulator Eksekusi C++ untuk Fase E (Informatika SMA Kelas X)
 * Menganalisis sintaksis, variabel dasar, operator aritmetika/logika, percabangan, dan perulangan.
 * Menyediakan eksekusi langkah-demi-langkah (trace) untuk visualisasi pedagogis.
 */

export interface SimulatorVariable {
  name: string;
  type: string;
  value: string | number | boolean;
}

export interface SimulationTraceStep {
  stepNumber: number;
  line: number;
  codeSnippet: string;
  explanation: string;
  variables: Record<string, string | number | boolean>;
  consoleOutput: string;
}

export interface SimulationResult {
  success: boolean;
  output: string;
  error?: string;
  errorLine?: number;
  executionSteps: number;
  variables: SimulatorVariable[];
  trace: SimulationTraceStep[];
  isSimulation: true;
}

export function runCppSimulation(code: string, rawInput: string = ''): SimulationResult {
  const lines = code.split('\n');
  const trace: SimulationTraceStep[] = [];
  let consoleOutput = '';
  let stepNumber = 0;
  const variables: Record<string, { type: string; value: any }> = {};

  const inputTokens = rawInput.trim().split(/\s+/).filter(t => t.length > 0);
  let inputIndex = 0;

  // Static Syntax Validation
  let hasMain = false;
  let openBraces = 0;
  let closeBraces = 0;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.includes('int main') || l.includes('void main') || l.includes('main()')) {
      hasMain = true;
    }
    openBraces += (l.match(/{/g) || []).length;
    closeBraces += (l.match(/}/g) || []).length;
  }

  if (!hasMain) {
    return {
      success: false,
      output: '',
      error: 'Kesalahan Sintaks: Fungsi utama "int main()" tidak ditemukan. Setiap program C++ harus memiliki titik awal eksekusi main().',
      errorLine: 1,
      executionSteps: 0,
      variables: [],
      trace: [],
      isSimulation: true,
    };
  }

  if (openBraces !== closeBraces) {
    return {
      success: false,
      output: '',
      error: `Kesalahan Sintaks: Tanda kurung kurawal tidak seimbang ({ = ${openBraces}, } = ${closeBraces}). Pastikan setiap blok kode ditutup dengan tanda '}'.`,
      executionSteps: 0,
      variables: [],
      trace: [],
      isSimulation: true,
    };
  }

  try {
    let inMain = false;
    const maxSteps = 1000;
    let stepCount = 0;

    const evaluateExpression = (expr: string): any => {
      let cleaned = expr.trim();
      if (cleaned.endsWith(';')) cleaned = cleaned.slice(0, -1).trim();

      const sortedVarNames = Object.keys(variables).sort((a, b) => b.length - a.length);
      let jsExpr = cleaned;
      for (const vName of sortedVarNames) {
        const val = variables[vName].value;
        const regex = new RegExp(`\\b${vName}\\b`, 'g');
        jsExpr = jsExpr.replace(regex, JSON.stringify(val));
      }

      jsExpr = jsExpr.replace(/&&/g, ' && ')
                     .replace(/\|\|/g, ' || ')
                     .replace(/!([^=])/g, '!$1');

      try {
        if (/^[0-9+\-*/%().<>=!&|\s"'\w]+$/.test(jsExpr)) {
          // eslint-disable-next-line no-new-func
          const result = new Function(`return (${jsExpr});`)();
          return result;
        }
      } catch {
        // fallback
      }
      return cleaned.replace(/^"|"$/g, '');
    };

    const recordStep = (lineNum: number, snippet: string, explanation: string) => {
      stepCount++;
      const currentVars: Record<string, any> = {};
      for (const [k, v] of Object.entries(variables)) {
        currentVars[k] = v.value;
      }
      trace.push({
        stepNumber: ++stepNumber,
        line: lineNum + 1,
        codeSnippet: snippet,
        explanation,
        variables: currentVars,
        consoleOutput,
      });
    };

    let pc = 0;
    while (pc < lines.length && stepCount < maxSteps) {
      const lineRaw = lines[pc];
      const line = lineRaw.trim();

      if (line.includes('main()') || line.includes('main (')) {
        inMain = true;
        recordStep(pc, line, 'Memulai eksekusi fungsi utama main()');
        pc++;
        continue;
      }

      if (!inMain) {
        pc++;
        continue;
      }

      if (line.startsWith('return ') || line === 'return 0;' || (line === '}' && pc === lines.length - 1)) {
        recordStep(pc, line, 'Program selesai dieksekusi dengan kode keluar 0.');
        break;
      }

      if (!line || line.startsWith('//') || line.startsWith('/*')) {
        pc++;
        continue;
      }

      // Output (cout << ... << endl;)
      if (line.includes('cout') && line.includes('<<')) {
        let coutPart = line.replace(/^.*?(std::)?cout\s*<<\s*/, '');
        if (coutPart.endsWith(';')) coutPart = coutPart.slice(0, -1);

        const segments = coutPart.split('<<').map(s => s.trim());
        let lineOut = '';

        for (const seg of segments) {
          if (seg === 'endl' || seg === 'std::endl' || seg === '"\\n"' || seg === "'\\n'") {
            lineOut += '\n';
          } else if (seg.startsWith('"') && seg.endsWith('"')) {
            lineOut += seg.slice(1, -1);
          } else if (seg.startsWith("'") && seg.endsWith("'")) {
            lineOut += seg.slice(1, -1);
          } else if (variables[seg] !== undefined) {
            lineOut += String(variables[seg].value);
          } else {
            const res = evaluateExpression(seg);
            lineOut += res !== undefined ? String(res) : seg;
          }
        }

        consoleOutput += lineOut;
        recordStep(pc, line, `Menampilkan teks/nilai ke layar terminal: "${lineOut.replace(/\n/g, '\\n')}"`);
        pc++;
        continue;
      }

      // Input (cin >> var;)
      if (line.includes('cin') && line.includes('>>')) {
        let cinPart = line.replace(/^.*?(std::)?cin\s*>>\s*/, '');
        if (cinPart.endsWith(';')) cinPart = cinPart.slice(0, -1);
        const vars = cinPart.split('>>').map(v => v.trim());

        for (const v of vars) {
          if (variables[v] !== undefined) {
            const nextInput = inputTokens[inputIndex++];
            if (nextInput !== undefined) {
              if (variables[v].type === 'int') {
                variables[v].value = parseInt(nextInput, 10) || 0;
              } else if (variables[v].type === 'double' || variables[v].type === 'float') {
                variables[v].value = parseFloat(nextInput) || 0.0;
              } else {
                variables[v].value = nextInput;
              }
              recordStep(pc, line, `Menerima input pengguna untuk variabel '${v}' bernilai: ${variables[v].value}`);
            } else {
              recordStep(pc, line, `Menunggu input untuk '${v}' (nilai default: ${variables[v].value})`);
            }
          }
        }
        pc++;
        continue;
      }

      // Variable Declaration & Initialization
      const declMatch = line.match(/^(int|double|float|char|string|bool)\s+([a-zA-Z_]\w*)(\s*=\s*(.+?))?;?$/);
      if (declMatch) {
        const type = declMatch[1];
        const name = declMatch[2];
        const valExpr = declMatch[4];

        let initialVal: any = type === 'string' ? '' : (type === 'bool' ? false : 0);
        if (valExpr) {
          initialVal = evaluateExpression(valExpr);
          if (type === 'int') initialVal = Math.floor(Number(initialVal) || 0);
          if (type === 'double' || type === 'float') initialVal = Number(initialVal) || 0;
          if (type === 'bool') initialVal = Boolean(initialVal);
          if (type === 'string') initialVal = String(initialVal).replace(/^"|"$/g, '');
        }

        variables[name] = { type, value: initialVal };
        recordStep(pc, line, `Deklarasi variabel '${name}' bertipe ${type} dengan nilai awal ${initialVal}`);
        pc++;
        continue;
      }

      // Variable Assignment (x = 5; total += 10;)
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*(=|\+=|-=|\*=|\/=|%=|\+\+|--)\s*(.+)?;?$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const op = assignMatch[2];
        const rightExpr = assignMatch[3];

        if (variables[varName]) {
          const oldVal = variables[varName].value;
          if (op === '++') {
            variables[varName].value = Number(oldVal) + 1;
          } else if (op === '--') {
            variables[varName].value = Number(oldVal) - 1;
          } else if (op === '=') {
            const evaluated = evaluateExpression(rightExpr);
            variables[varName].value = variables[varName].type === 'int' ? Math.floor(Number(evaluated)) : evaluated;
          } else if (op === '+=') {
            variables[varName].value = Number(oldVal) + Number(evaluateExpression(rightExpr));
          } else if (op === '-=') {
            variables[varName].value = Number(oldVal) - Number(evaluateExpression(rightExpr));
          } else if (op === '*=') {
            variables[varName].value = Number(oldVal) * Number(evaluateExpression(rightExpr));
          }

          recordStep(pc, line, `Variabel '${varName}' diperbarui dari ${oldVal} menjadi ${variables[varName].value}`);
        }
        pc++;
        continue;
      }

      // If condition
      if (line.startsWith('if ') || line.startsWith('if(')) {
        const condMatch = line.match(/if\s*\((.+?)\)/);
        if (condMatch) {
          const condition = condMatch[1];
          const isTrue = Boolean(evaluateExpression(condition));
          recordStep(pc, line, `Mengevaluasi kondisi if (${condition}) -> ${isTrue ? 'BENAR (TRUE)' : 'SALAH (FALSE)'}`);
        }
        pc++;
        continue;
      }

      // For Loop
      if (line.startsWith('for ') || line.startsWith('for(')) {
        const forMatch = line.match(/for\s*\(\s*(int\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\)/);
        if (forMatch) {
          const varName = forMatch[2];
          const startVal = Number(evaluateExpression(forMatch[3]));
          const condExpr = forMatch[4];
          const incExpr = forMatch[5];

          variables[varName] = { type: 'int', value: startVal };
          recordStep(pc, line, `Inisialisasi perulangan for: variabel '${varName}' = ${startVal}`);

          let bodyLines: string[] = [];
          let loopEnd = pc + 1;
          let braceDepth = 0;
          for (let k = pc; k < lines.length; k++) {
            if (lines[k].includes('{')) braceDepth++;
            if (lines[k].includes('}')) {
              braceDepth--;
              if (braceDepth <= 0 && k > pc) {
                loopEnd = k;
                break;
              }
            }
            if (k > pc && braceDepth > 0) {
              bodyLines.push(lines[k]);
            }
          }

          let iterations = 0;
          while (iterations < 200) {
            iterations++;
            stepCount++;
            const condResult = evaluateExpression(condExpr);
            recordStep(pc, `Iterasi ${iterations}: ${condExpr}`, `Kondisi bernilai ${condResult ? 'BENAR (Lanjutkan)' : 'SALAH (Berhenti)'}`);
            if (!condResult) break;

            for (const bLine of bodyLines) {
              const bTrim = bLine.trim();
              if (bTrim.includes('cout') && bTrim.includes('<<')) {
                let coutPart = bTrim.replace(/^.*?(std::)?cout\s*<<\s*/, '');
                if (coutPart.endsWith(';')) coutPart = coutPart.slice(0, -1);
                const segs = coutPart.split('<<').map(s => s.trim());
                let out = '';
                for (const seg of segs) {
                  if (seg === 'endl' || seg === 'std::endl' || seg === '"\\n"') out += '\n';
                  else if (seg.startsWith('"') && seg.endsWith('"')) out += seg.slice(1, -1);
                  else if (variables[seg] !== undefined) out += String(variables[seg].value);
                  else out += String(evaluateExpression(seg));
                }
                consoleOutput += out;
                recordStep(pc, bTrim, `[Iterasi ${iterations}] Output: "${out.replace(/\n/g, '\\n')}"`);
              } else if (bTrim.includes('=')) {
                const m = bTrim.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|=|\+\+)\s*(.+)?;?$/);
                if (m && variables[m[1]]) {
                  if (m[2] === '++') variables[m[1]].value = Number(variables[m[1]].value) + 1;
                  else if (m[2] === '+=') variables[m[1]].value = Number(variables[m[1]].value) + Number(evaluateExpression(m[3]));
                  else if (m[2] === '=') variables[m[1]].value = evaluateExpression(m[3]);
                  recordStep(pc, bTrim, `[Iterasi ${iterations}] Variabel '${m[1]}' = ${variables[m[1]].value}`);
                }
              }
            }

            if (incExpr.includes('++')) {
              variables[varName].value = Number(variables[varName].value) + 1;
            } else if (incExpr.includes('+=')) {
              const incVal = Number(incExpr.split('+=')[1].trim()) || 1;
              variables[varName].value = Number(variables[varName].value) + incVal;
            }
          }

          pc = loopEnd + 1;
          continue;
        }
      }

      pc++;
    }

    return {
      success: true,
      output: consoleOutput || '(Program dieksekusi normal tanpa teks keluaran)',
      executionSteps: stepCount,
      variables: Object.entries(variables).map(([k, v]) => ({ name: k, type: v.type, value: v.value })),
      trace,
      isSimulation: true,
    };
  } catch (err: any) {
    return {
      success: false,
      output: consoleOutput,
      error: `Kesalahan Logika atau Eksekusi: ${err?.message || 'Gagal memproses kode'}`,
      executionSteps: 0,
      variables: Object.entries(variables).map(([k, v]) => ({ name: k, type: v.type, value: v.value })),
      trace,
      isSimulation: true,
    };
  }
}
