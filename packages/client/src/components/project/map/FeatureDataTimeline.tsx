import { toPairs } from "lodash";
import { TimeSpecification } from "@lasso/dataprep";
import { FC } from "react";
import { Feature } from "geojson";
import { DonutDay } from "./DonutDay";

interface FeatureDataTimelineProps {
  feature: Feature;
  timeSpecification: TimeSpecification;
  setCurrentTimeKey: (timeKey: string | null) => void;
  currentTimeKey: string | null;
  layerId: string;
}

export const FeatureDataTimeline: FC<FeatureDataTimelineProps> = ({
  feature,
  timeSpecification,
  setCurrentTimeKey,
  currentTimeKey,
  layerId,
}) => {
  return (
    <div className="timelines">
      {/* TODO: handle cases where no monthsLabel */}
      {toPairs(timeSpecification.monthsLabels).map(([monthKey, monthLabel]) => {
        return (
          <div className="season" key={monthKey}>
            {/* TODO: retrieve current language in transiflex or context ? */}
            <label>{monthLabel.label.en}</label>
            <div className="d-flex">
              {toPairs(timeSpecification.daysLabels).map(([dayKey, dayLabel]) => {
                return (
                  <div key={dayKey} className="timeline">
                    <label>{dayLabel.label.en}</label>
                    <DonutDay
                      timelineKey={`${monthKey}|${dayKey}`}
                      feature={feature}
                      timeSpecification={timeSpecification}
                      setCurrentTimeKey={setCurrentTimeKey}
                      currentTimeKey={currentTimeKey}
                      layerId={layerId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
