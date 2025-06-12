import { DeepSet } from 'deep-equality-data-structures';
import { max, range, sortBy, takeWhile } from 'lodash';
import { memoize } from '../../util/memoize';
import { Activity } from '../activity-selection';

export interface WeighedActivity extends Activity {
    weight: number;
}

interface WeighedActivitySelection {
    selection: DeepSet<WeighedActivity>;
    totalWeight: number;
}

function addOne(subset: WeighedActivitySelection, activity?: WeighedActivity): WeighedActivitySelection {
    const newSet = new DeepSet([...subset.selection.values()]);
    if(activity === undefined) {
        return {
            selection: newSet,
            totalWeight: subset.totalWeight
        };
    }
    newSet.add(activity);
    return {
        selection: newSet,
        totalWeight: subset.totalWeight + activity.weight
    };
}

export function weighedActivitySelection(activities: WeighedActivity[]): [DeepSet<WeighedActivity>, number] {
    activities = [...activities]; // copy list, just in case user depends on the passed argument not being changed.
    sortBy(activities, a => a.end);

    /*
    Line of reasoning: now that the activities are sorted by end, let
    sol(i) = all non-overlapping selections of activities from the first i activities.
    opt(i) = argmax sol(i) by weight
    p(j) = max {i in range(n) so that activity[i].end <= activity[j-1].start}
    note: j-1, i-1 because of 0-based indexing.
    obvservation: opt(0) = ∅, 
    opt(j) = argmax { opt(j-1), opt(p(j)) ∪ { activity[j] } } by total weight.
    */

    const p: (j: number) => number = memoize(
        function(j) {

            if(j <= 0) {
                return -1;
            }

            if(j >= activities.length) {
                return activities.length - 1; // there are activities.length activities that start no later than the latest
            }

            const acitivityJStart = activities[j].start;
            const activitiesThatEndNoLaterThanStartOfJ = takeWhile(range(activities.length), i => activities[i].end <= acitivityJStart);

            if(activitiesThatEndNoLaterThanStartOfJ.length === 0) {
                return -1;
            }
            
            // must have at least 1 element, becuase j activity starts before j-th activity ends.
            return max(activitiesThatEndNoLaterThanStartOfJ); 
        }
    );

    const opt: (j: number) => WeighedActivitySelection = memoize(
        function(j): WeighedActivitySelection {
            if(j < 0) {
                return {
                    selection: new DeepSet(),
                    totalWeight: 0
                };
            }
            const optionWithoutJ: WeighedActivitySelection = opt(j - 1);
            const optionWithJ: WeighedActivitySelection = addOne(opt(p(j)), activities[j]);
            return optionWithJ.totalWeight > optionWithoutJ.totalWeight ? optionWithJ : optionWithoutJ;
        }
    );

    const ret = opt(activities.length);
    return [ret.selection, ret.totalWeight];
}