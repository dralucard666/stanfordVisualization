import { AbstractParsedRandom, HierarchicalInfo, serializeStepString } from "cgv"
import { useBaseStore } from "../global"
import { DeleteIcon } from "../icons/delete"
import { BlurInput } from "./blur-input"

export function GUIRandomStep({ value }: { value: AbstractParsedRandom<HierarchicalInfo> }) {
    const store = useBaseStore()
    return (
        <div className="d-flex flex-column mx-3 mb-3">
            {value.children.map((child, i) => (
                <div key={i} className="d-flex flex-row align-items-center border-bottom">
                    <BlurInput
                        className="form-control form-control-sm"
                        type="text"
                        value={value.probabilities[i]}
                        onBlur={(e) =>
                            store.getState().replace(value, {
                                ...value,
                                probabilities: value.probabilities.map((currentValue, value) =>
                                    i === value ? e.target.valueAsNumber : currentValue
                                ),
                            })
                        }
                    />
                    <div className="flex-grow-1 ms-2 p-3 pointer" onClick={store.getState().select.bind(null, child)}>
                        {serializeStepString(child)}
                    </div>
                    <div
                        onClick={() => store.getState().remove(child)}
                        className="d-flex align-items-center ms-2 btn btn-sm btn-outline-danger">
                        <DeleteIcon />
                    </div>
                </div>
            ))}
            <div className="btn btn-outline-success">Add</div>
        </div>
    )
}
