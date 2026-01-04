
import React, { useState, useCallback } from 'react';
import { QUESTIONS, ARM_TYPES } from './constants';
import { ArmType, ArmTypeInfo, DiagnosisResult } from './types';
import { getPersonalizedInsight } from './services/chatgptService';
import { LucideChevronRight, LucideCheck, LucideSparkles, LucideCalendar, LucideChevronLeft, LucideLoader2 } from 'lucide-react';

// Components
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 fade-in">
    <div className="mb-8 tracking-[0.2em] text-stone-400 uppercase text-sm font-luxury">Arm Diagnosis</div>
    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-stone-800">
      二の腕やせ診断<br />
      <span className="text-amber-700 italic font-luxury">あなたのタイプがわかる</span>
    </h1>
    <p className="max-w-md text-stone-500 mb-8 leading-relaxed text-sm">
      10の質問に答えるだけで<br />
      <span className="font-semibold text-stone-700">二の腕が戻らない理由</span>がわかります
    </p>
    <button
      onClick={onStart}
      className="group relative px-12 py-4 bg-stone-900 text-white overflow-hidden transition-all hover:bg-stone-800 active:scale-95"
    >
      <span className="relative z-10 flex items-center gap-2 tracking-widest">
        診断をはじめる <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </button>
  </div>
);

const QuestionView: React.FC<{
  questionIdx: number;
  totalQuestions: number;
  onAnswer: (scores: Partial<Record<ArmType, number>>) => void;
  onBack: () => void;
}> = ({ questionIdx, totalQuestions, onAnswer, onBack }) => {
  const question = QUESTIONS[questionIdx];
  const progress = ((questionIdx + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 fade-in">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-1 text-sm">
          <LucideChevronLeft size={16} /> 戻る
        </button>
        <span className="text-xs font-luxury tracking-widest text-stone-400 uppercase">Step {questionIdx + 1} / {totalQuestions}</span>
      </div>
      
      <div className="w-full bg-stone-100 h-px mb-12">
        <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-4 leading-relaxed">{question.text}</h2>
        {question.subtext && <p className="text-sm text-stone-400 italic">{question.subtext}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option.scores)}
            className="w-full text-center p-8 border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all group flex flex-col items-center justify-center gap-3"
          >
            <span className="text-lg font-semibold text-stone-700 group-hover:text-amber-900 transition-colors">{option.label}</span>
            <div className="w-6 h-6 rounded-full border-2 border-stone-300 group-hover:border-amber-500 transition-all flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-all"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ResultView: React.FC<{ result: DiagnosisResult }> = ({ result }) => {
  const [ctaMode, setCtaMode] = useState<'gentle' | 'direct'>('gentle');

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-6">
          <LucideSparkles className="text-amber-600" size={32} />
        </div>
        <div className="text-stone-400 tracking-[0.3em] uppercase text-xs mb-4 font-luxury">Diagnosis Result</div>
        <h2 className="text-sm text-stone-500 mb-2">あなたの診断結果</h2>
        <div className="text-2xl md:text-3xl font-bold text-amber-700 mb-4 font-serif">{result.topType.name}</div>
        <div className="text-lg md:text-xl text-stone-700 mb-6 leading-relaxed">{result.topType.catchphrase}</div>
      </div>

      <div className="bg-white border border-stone-100 p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="text-8xl font-luxury italic">Result</span>
        </div>
        
        <div className="mb-10">
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base">{result.topType.description}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-xs tracking-widest text-stone-400 uppercase font-luxury mb-4 border-b border-stone-100 pb-2">専門家からのメッセージ</h3>
          <p className="text-stone-800 font-serif leading-relaxed italic bg-stone-50 p-6 rounded-sm">
            {result.aiInsight || "あなたの二の腕には、まだ眠っている本来の美しさがあります。"}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xs tracking-widest text-stone-400 uppercase font-luxury mb-4 border-b border-stone-100 pb-2">アドバイス</h3>
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap mb-8">{result.topType.advice}</p>
          
          {/* 食事アドバイス */}
          {result.topType.dietAdvice && result.topType.dietAdvice.length > 0 && (
            <div className="mb-8 p-6 bg-stone-50 rounded-sm">
              <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="text-amber-600 font-serif">【食事】</span>
              </h4>
              <ul className="space-y-3">
                {result.topType.dietAdvice.map((advice, idx) => (
                  <li key={idx} className="text-stone-700 leading-relaxed flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-bold">・</span>
                    <span className="flex-1">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 行動アドバイス */}
          {result.topType.actionAdvice && result.topType.actionAdvice.length > 0 && (
            <div className="mb-8 p-6 bg-stone-50 rounded-sm">
              <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="text-amber-600 font-serif">【行動】</span>
              </h4>
              <ul className="space-y-3">
                {result.topType.actionAdvice.map((advice, idx) => (
                  <li key={idx} className="text-stone-700 leading-relaxed flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-bold">・</span>
                    <span className="flex-1">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-sm">
            <p className="text-stone-700 leading-relaxed text-sm">
              無料カウンセリングでは、<br />
              あなたの状態に合わせた<br />
              二の腕改善の進め方を<br />
              具体的にお伝えしています。
            </p>
            <p className="text-stone-600 leading-relaxed text-sm mt-4 italic">
              「少し話を聞いてみたい」<br />
              そんな気持ちで大丈夫ですよ。
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {result.topType.keywords.map(k => (
              <span key={k} className="text-[10px] tracking-widest uppercase bg-stone-100 text-stone-500 px-3 py-1 rounded-full">#{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with toggle */}
      <div className="bg-white border-2 border-stone-200 p-10 text-center rounded-sm mb-4 shadow-sm">
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setCtaMode('gentle')}
            className={`px-4 py-2 text-xs tracking-widest transition-all ${
              ctaMode === 'gentle' 
                ? 'bg-stone-900 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            パターン①
          </button>
          <button
            onClick={() => setCtaMode('direct')}
            className={`px-4 py-2 text-xs tracking-widest transition-all ${
              ctaMode === 'direct' 
                ? 'bg-stone-900 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            パターン②
          </button>
        </div>

        {ctaMode === 'gentle' ? (
          <>
            <h3 className="text-xl font-bold mb-4 text-stone-900">無料で受け取る</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              今のあなたの状態に合わせた<br />
              <span className="font-semibold text-stone-900">「二の腕タイプ別アドバイス」</span>を<br />
              LINEで無料でお伝えしています。
            </p>
            <p className="text-stone-500 text-xs mb-4 leading-relaxed">
              ✨ 公式LINE登録特典 ✨<br />
              クーポンと質問に答えてくれるチャットAIをご用意しています
            </p>
            <a 
              href="https://lin.ee/vLgcZ4o" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-12 py-4 bg-stone-900 text-white font-bold tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-2 mx-auto inline-block"
            >
              <LucideChevronRight size={20} /> 無料で受け取る
            </a>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4 text-stone-900">無料カウンセリングを予約する</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              実際に<br />
              <span className="font-semibold text-stone-900">「同じ悩みだった方」</span>が<br />
              6〜8回でどんな変化をしたか<br />
              体験ベースでご説明できます。
            </p>
            <a 
              href="https://lin.ee/vLgcZ4o" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-12 py-4 bg-stone-900 text-white font-bold tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-2 mx-auto inline-block"
            >
          <LucideCalendar size={20} /> 無料カウンセリングを予約する
            </a>
          </>
        )}
        <p className="mt-4 text-[10px] text-stone-400 uppercase tracking-widest">Limited availability for new clients</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [step, setStep] = useState<'landing' | 'quiz' | 'loading' | 'result'>('landing');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<ArmType, number>>[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const startQuiz = () => setStep('quiz');

  const handleAnswer = useCallback(async (scores: Partial<Record<ArmType, number>> & { YES_COUNT?: number }) => {
    const newAnswers = [...answers, scores];
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setStep('loading');
      
      // Count total YES answers
      // YES is selected if any type has a score > 0 (meaning user selected "はい")
      let yesCount = 0;
      newAnswers.forEach(answer => {
        let hasYes = false;
        Object.entries(answer).forEach(([type, score]) => {
          if (type !== 'YES_COUNT' && Object.values(ArmType).includes(type as ArmType) && (score as number) > 0) {
            hasYes = true;
          }
        });
        if (hasYes) {
          yesCount++;
        }
      });

      // Determine type based on YES count (画像のロジックに従う)
      let topTypeKey: ArmType;
      if (yesCount >= 7) {
        // YESが7~10個 → むくみ&代謝ダウンタイプ
        topTypeKey = ArmType.EDEMA_METABOLISM;
      } else if (yesCount >= 4) {
        // YESが4~6個 → 姿勢ゆがみタイプ
        topTypeKey = ArmType.POSTURE_USAGE;
      } else if (yesCount >= 2) {
        // YESが2~3個 → 食習慣タイプ
        topTypeKey = ArmType.DIET_HABIT;
      } else {
        // YESが0~1個 → 隠れ筋力不足タイプ
        topTypeKey = ArmType.MUSCLE_FOUNDATION;
      }

      const topTypeInfo = ARM_TYPES[topTypeKey];

      // Get ChatGPT Insight
      const aiInsight = await getPersonalizedInsight(topTypeInfo);

      setDiagnosisResult({
        topType: topTypeInfo,
        scores: {} as Record<ArmType, number>,
        aiInsight
      });
      setStep('result');
    }
  }, [answers, currentQuestionIdx]);

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    } else {
      setStep('landing');
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      <header className="py-8 px-6 flex justify-center border-b border-stone-50">
        <div className="font-luxury tracking-[0.4em] text-xl font-light uppercase text-stone-900">
          Elegance <span className="text-amber-700">Studio</span>
        </div>
      </header>

      <main className="container mx-auto pb-20">
        {step === 'landing' && <LandingPage onStart={startQuiz} />}
        
        {step === 'quiz' && (
          <QuestionView
            questionIdx={currentQuestionIdx}
            totalQuestions={QUESTIONS.length}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 fade-in">
            <LucideLoader2 size={48} className="text-amber-600 animate-spin mb-6" />
            <div className="text-stone-400 font-luxury tracking-widest text-xs mb-2 uppercase">Analyzing Your Profile</div>
            <h2 className="text-xl font-serif text-stone-700">プロフェッショナルな知見で<br />あなたの二の腕を分析中...</h2>
          </div>
        )}

        {step === 'result' && diagnosisResult && (
          <ResultView result={diagnosisResult} />
        )}
      </main>

      <footer className="py-12 border-t border-stone-50 bg-stone-50/30 text-center">
        <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase">
          &copy; 2024 Elegance Studio Japan. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
