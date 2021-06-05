import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useCurrency, useCurrencyRegister, Locales, Currencies } from '../.';

import './index.css';

type InputRegisterProps = {
  style: 'currency' | 'decimal';
  precision: number;
  locale: string;
  currency: string;
};

const App = () => {
  const [neg, setNeg] = React.useState('allow');

  const [props, setProps] = React.useState<InputRegisterProps>({
    style: 'currency',
    precision: 2,
    locale: 'pt-BR',
    currency: 'BRL',
  });

  return (
    <div className="playground">
      <fieldset>
        <legend>Props form useCurrency:</legend>
        <SelectNegative onChange={(s: string) => setNeg(s)} />
      </fieldset>
      <fieldset>
        <legend>Props form useCurrency and useCurrencyRegister:</legend>
        <SelectStyle
          onChange={(s: string) => setProps(p => ({ ...p, style: s as any }))}
        />
        <Precision
          onChange={(s: string) =>
            setProps(p => ({ ...p, precision: Number(s) }))
          }
        />
        <SelectLocales
          onChange={(s: string) => setProps(p => ({ ...p, locale: s }))}
        />

        <SelectCurrency
          onChange={(s: string) => setProps(p => ({ ...p, currency: s }))}
        />
      </fieldset>

      <div>
        <h3>Calculator - Controlled Input Currency</h3>
        <UncontrolledInputCurrency {...props} negative={neg as any} />
      </div>
      <div>
        <h3>Calculator - Controlled Input Currency</h3>
        <ControlledInputCurrency {...props} negative={neg as any} />
      </div>
      <div>
        <h3>Calculator - Uncontrolled Input Currency Register</h3>
        <UncontrolledInputRegisterCalculator {...props} />
      </div>
    </div>
  );
};

type Props = {
  onChange: (s: string) => void;
};

const Precision = ({ onChange }: Props) => {
  return (
    <div>
      <label htmlFor="precision">Precision:</label>
      <input
        id="precision"
        type="range"
        min="0"
        max="10"
        defaultValue={2}
        onChange={e => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

const SelectStyle = ({ onChange }: Props) => (
  <div>
    <label htmlFor="style">Style:</label>
    <select
      id="style"
      defaultValue="currency"
      onChange={e => onChange(e.currentTarget.value)}
    >
      <option value="currency">Currency</option>
      <option value="decimal">Decimal</option>
    </select>
  </div>
);

const SelectNegative = ({ onChange }: Props) => (
  <div>
    <label htmlFor="style">Negative:</label>
    <select
      id="style"
      defaultValue="allow"
      onChange={e => onChange(e.currentTarget.value)}
    >
      <option value="allow">Allow</option>
      <option value="always">Always</option>
      <option value="never">Never</option>
    </select>
  </div>
);

const SelectLocales = ({ onChange }: Props) => (
  <div>
    <label htmlFor="locales">Locales:</label>
    <select
      id="locales"
      defaultValue="pt-BR"
      onChange={e => onChange(e.currentTarget.value)}
    >
      {Object.keys(Locales).map(key => (
        <option value={Locales[key]} key={key}>
          {key}
        </option>
      ))}
    </select>
  </div>
);

const SelectCurrency = ({ onChange }: Props) => (
  <div>
    <label htmlFor="currency">Currency:</label>
    <select
      id="currency"
      defaultValue="BRL"
      onChange={e => onChange(e.currentTarget.value)}
    >
      {Object.keys(Currencies).map(key => (
        <option value={Currencies[key]} key={key}>
          {key}
        </option>
      ))}
    </select>
  </div>
);

const UncontrolledInputCurrency = (
  props: InputRegisterProps & { negative: 'allow' | 'always' | 'never' }
) => {
  const { onClick, onChange, onKeyDown, format } = React.useMemo(
    () => useCurrency(props),
    [props]
  );

  const defaultValue = format('000');

  return (
    <input
      key={defaultValue}
      type="text"
      onChange={onChange}
      onKeyDown={onKeyDown}
      onClick={onClick}
      defaultValue={defaultValue}
    />
  );
};

const ControlledInputCurrency = (
  props: InputRegisterProps & { negative: 'allow' | 'always' | 'never' }
) => {
  const { onClick, onChange, onKeyDown, format, toNumber } = React.useMemo(
    () => useCurrency(props),
    [props]
  );
  const [value, setValue] = React.useState(format('000'));
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setValue(format('000'));
  }, [format, props]);

  return (
    <input
      type="text"
      onChange={e => {
        onChange(e);
        setValue(e.target.value);
      }}
      onKeyDown={onKeyDown}
      onClick={onClick}
      value={value}
      ref={ref}
    />
  );
};

const UncontrolledInputRegisterCalculator = React.memo(
  (props: InputRegisterProps) => {
    const {
      onClick,
      onChange,
      onKeyDown,
      format,
      triggerChange,
      decimalSeparator,
    } = useCurrencyRegister(props);
    const ref = React.useRef<HTMLInputElement>(null);
    const defaultValue = format('000');

    function handleClick(event: React.MouseEvent<any, MouseEvent>) {
      event.preventDefault();
      const { value } = event.currentTarget.dataset;
      triggerChange(value, ref?.current);
    }

    return (
      <div className="calculator" key={defaultValue}>
        <input
          type="text"
          onClick={onClick}
          onChange={onChange}
          onKeyDown={onKeyDown}
          defaultValue={defaultValue}
          autoFocus={true}
          ref={ref}
        />
        <table>
          <tbody>
            <tr>
              <td data-value="7" onClick={handleClick}>
                <span>7</span>
              </td>
              <td data-value="8" onClick={handleClick}>
                <span>8</span>
              </td>
              <td data-value="9" onClick={handleClick}>
                <span>9</span>
              </td>
              <td className="operators-column" rowSpan={4}>
                <div className="operators">
                  <span data-value="/" onClick={handleClick}>
                    ÷
                  </span>
                  <span data-value="*" onClick={handleClick}>
                    x
                  </span>
                  <span data-value="+" onClick={handleClick}>
                    +
                  </span>
                  <span data-value="-" onClick={handleClick}>
                    -
                  </span>
                </div>
              </td>
              <td data-value="L" onClick={handleClick}>
                <span>{`<=`}</span>
              </td>
            </tr>
            <tr>
              <td data-value="4" onClick={handleClick}>
                <span>4</span>
              </td>
              <td data-value="5" onClick={handleClick}>
                <span>5</span>
              </td>
              <td data-value="6" onClick={handleClick}>
                <span>6</span>
              </td>
              <td
                className="custom"
                rowSpan={3}
                data-value="="
                onClick={handleClick}
              >
                <span className="equal"> = </span>
              </td>
            </tr>
            <tr>
              <td data-value="1" onClick={handleClick}>
                <span>1</span>
              </td>
              <td data-value="2" onClick={handleClick}>
                <span>2</span>
              </td>
              <td data-value="3" onClick={handleClick}>
                <span>3</span>
              </td>
            </tr>
            <tr>
              <td data-value={decimalSeparator} onClick={handleClick}>
                <span>{decimalSeparator}</span>
              </td>
              <td data-value="0" onClick={handleClick}>
                <span>0</span>
              </td>
              <td data-value="C" onClick={handleClick} className="custom">
                <span>CE</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

ReactDOM.render(<App />, document.getElementById('root'));
