import { TVar } from "../../timeseris/TVar";
import { Path } from "../../svg/Path";
import type { ChartYControl } from "../view/ChartYControl";
import type { ChartXControl } from "../view/ChartXControl";
import type { PlotOptions } from "./Plot";
import type { LineObject, PineData } from "../../domain/PineData";

type Props = {
    xc: ChartXControl,
    yc: ChartYControl,
    tvar: TVar<PineData[]>,
    name: string,
    atIndex: number,
    options: PlotOptions;
    depth?: number;
}

const PlotDrawingLine = (props: Props) => {
    const { xc, yc, tvar, name, atIndex, depth, options } = props

    function plot() {
        const lines = new Map<number, Path>();

        const datas = tvar.getByIndex(0);
        const data = datas ? datas[atIndex] : undefined;
        const lineObject = data ? data.value as LineObject[] : undefined;
        if (lineObject !== undefined) {
            for (let i = 0; i < lineObject.length; i++) {
                const { id, color, x1, y1, x2, y2, style, width, xloc } = lineObject[i]

                let xPos1: number;
                let xPos2: number;
                switch (xloc) {
                    case 'time':
                        xPos1 = xc.xb(xc.bt(x1));
                        xPos2 = xc.xb(xc.bt(x2));
                        break

                    case 'bar_index':
                    default:
                        xPos1 = xc.xb(xc.br(x1));
                        xPos2 = xc.xb(xc.br(x2));
                        break
                }

                const yPos1 = yc.yv(y1)
                const yPos2 = yc.yv(y2)

                let path = lines.get(id);
                if (!path) {
                    path = new Path();
                    lines.set(id, path);
                }

                path.moveto(xPos1, yPos1)
                path.lineto(xPos2, yPos2)
                path.stroke = color;
                path.strokeWidth = width;
                switch (style) {
                    case 'style_dashed':
                        path.strokeDasharray = "4 3"
                        break

                    case 'style_dotted':
                        path.strokeDasharray = "1 2"
                        break

                    case "style_solid":
                    default:
                }
            }
        }

        return lines
    }

    const lines = plot();

    return (
        <>
            {Array.from(lines.entries()).map(([id, path]) => path.render({ key: id }))}
        </>
    )
}

export default PlotDrawingLine;