import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Callout,
  DefaultButton,
  DirectionalHint,
  mergeStyleSets,
  getTheme,
  Stack,
} from "@fluentui/react";
import { getDayEnd, getDayStart } from "utils";

import { useBoolean, useId } from "@fluentui/react-hooks";
import { CqlDate } from "pages/Explore/utils/cql/types";
import { opEnglish } from "../constants";
import CalendarControl from "./CalendarControl";
import ControlFooter from "../ControlFooter";
import { Dayjs } from "dayjs";
import { DateFieldProvider } from "./context";
import { ValidAction, ValidationState } from "./types";

interface DateFieldProps {
  dateExpression: CqlDate;
}

const getStartRangeValue = (d: CqlDate) => {
  return getDayStart(d.isRange ? d.value[0] : d.value);
};

const getEndRangeValue = (d: CqlDate) => {
  return getDayStart(d.isRange ? d.value[1] : undefined);
};

const initialValidationState = {
  start: true,
  end: true,
};

const validationReducer = (state: ValidationState, action: ValidAction) => {
  return { ...state, ...action };
};

const DateField = ({ dateExpression }: DateFieldProps) => {
  const [startDate, setStart] = useState<Dayjs>(getStartRangeValue(dateExpression));
  const [endDate, setEnd] = useState<Dayjs>(getEndRangeValue(dateExpression));
  const [controlValidState, validationDispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("query-daterange-button");
  const labelId = useId("query-daterange-label");

  const minDay = useMemo(() => {
    return getDayStart(dateExpression.min);
  }, [dateExpression.min]);

  const maxDay = useMemo(() => {
    return getDayEnd(dateExpression.max);
  }, [dateExpression.max]);

  // When there is a new default expression, update the start and end date
  useEffect(() => {
    setStart(getStartRangeValue(dateExpression));
    setEnd(getEndRangeValue(dateExpression));
  }, [dateExpression]);

  const handleSave = useCallback(() => {}, []);

  const handleCancel = useCallback(() => {
    toggle();
  }, [toggle]);

  // Exact and range labels don't need an operator label, the dates will be self explanatory
  const opLabel = opEnglish[dateExpression.operator];
  const shouldUseLabel = ["gt", "gte", "lt", "lte"].includes(
    dateExpression.operator
  );

  const displayText = dateExpression.isRange
    ? dateExpression.value.join(" - ")
    : dateExpression.value;

  // Range or not?
  // Disable apply until changes
  // Disable apply if invalid

  return (
    <>
      <DefaultButton id={buttonId} onClick={toggle}>
        {shouldUseLabel && opLabel} {displayText}
      </DefaultButton>
      <DateFieldProvider
        state={{
          validMinDate: minDay,
          validMaxDate: maxDay,
          setValidation: validationDispatch,
        }}
      >
        {isCalloutVisible && (
          <Callout
            className={styles.callout}
            ariaLabelledBy={labelId}
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={toggle}
            directionalHint={DirectionalHint.bottomLeftEdge}
            isBeakVisible={false}
            setInitialFocus
          >
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <CalendarControl
                rangeType="start"
                date={startDate}
                onSelectDate={setStart}
              />
              {dateExpression.isRange && (
                <CalendarControl
                  rangeType="end"
                  date={endDate}
                  onSelectDate={setEnd}
                />
              )}
            </Stack>
            <ControlFooter
              onCancel={handleCancel}
              onSave={handleSave}
              isValid={controlValidState.start && controlValidState.end}
            />
          </Callout>
        )}
      </DateFieldProvider>
    </>
  );
};

export default DateField;

const styles = mergeStyleSets({
  callout: {
    // minWidth: 420,
    padding: "20px 24px",
    backgroundColor: getTheme().semanticColors.bodyBackground,
  },
});
