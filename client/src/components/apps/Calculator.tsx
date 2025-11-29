import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let result = currentValue;

      switch (operator) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "*":
          result = currentValue * inputValue;
          break;
        case "/":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    if (!operator || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result = previousValue;

    switch (operator) {
      case "+":
        result = previousValue + inputValue;
        break;
      case "-":
        result = previousValue - inputValue;
        break;
      case "*":
        result = previousValue * inputValue;
        break;
      case "/":
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const buttonClass = "h-12 text-lg font-medium";

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div 
        className="bg-secondary/50 rounded-lg p-4 text-right"
        data-testid="calculator-display"
      >
        <div className="text-muted-foreground text-sm h-5">
          {previousValue !== null && `${previousValue} ${operator}`}
        </div>
        <div className="text-3xl font-light truncate" data-testid="text-calc-result">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 flex-1">
        <Button variant="secondary" className={buttonClass} onClick={clear} data-testid="button-calc-clear">C</Button>
        <Button variant="secondary" className={buttonClass} onClick={toggleSign} data-testid="button-calc-sign">+/-</Button>
        <Button variant="secondary" className={buttonClass} onClick={percentage} data-testid="button-calc-percent">%</Button>
        <Button variant="default" className={buttonClass} onClick={() => performOperation("/")} data-testid="button-calc-divide">/</Button>

        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("7")} data-testid="button-calc-7">7</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("8")} data-testid="button-calc-8">8</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("9")} data-testid="button-calc-9">9</Button>
        <Button variant="default" className={buttonClass} onClick={() => performOperation("*")} data-testid="button-calc-multiply">x</Button>

        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("4")} data-testid="button-calc-4">4</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("5")} data-testid="button-calc-5">5</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("6")} data-testid="button-calc-6">6</Button>
        <Button variant="default" className={buttonClass} onClick={() => performOperation("-")} data-testid="button-calc-subtract">-</Button>

        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("1")} data-testid="button-calc-1">1</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("2")} data-testid="button-calc-2">2</Button>
        <Button variant="ghost" className={buttonClass} onClick={() => inputDigit("3")} data-testid="button-calc-3">3</Button>
        <Button variant="default" className={buttonClass} onClick={() => performOperation("+")} data-testid="button-calc-add">+</Button>

        <Button variant="ghost" className={`${buttonClass} col-span-2`} onClick={() => inputDigit("0")} data-testid="button-calc-0">0</Button>
        <Button variant="ghost" className={buttonClass} onClick={inputDecimal} data-testid="button-calc-decimal">.</Button>
        <Button variant="default" className={buttonClass} onClick={calculate} data-testid="button-calc-equals">=</Button>
      </div>
    </div>
  );
}
