import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText, G, Line, Path } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type ChartDataPoint = {
  label: string;
  value1: number;
  value2?: number;
  value3?: number;
};

type AreaChartProps = {
  data: ChartDataPoint[];
  title?: string;
  legend1?: string;
  legend2?: string;
  legend3?: string;
  height?: number;
  width?: number;
  color1?: string;
  color2?: string;
  color3?: string;
};

export default function AreaChart({
  data,
  title,
  legend1 = "Value 1",
  legend2 = "Value 2",
  legend3,
  height = 240,
  width = Dimensions.get('window').width - 40,
  color1 = "#122a2f",
  color2 = "#98e29a",
  color3 = "#e2e8f0"
}: AreaChartProps) {
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartHeight = height - paddingTop - paddingBottom;
  const paddingHorizontal = 40;
  const chartWidth = width - paddingHorizontal * 1.5;

  const maxValue = Math.max(
    ...data.flatMap(d => [d.value1, d.value2 || 0, Math.abs(d.value3 || 0)]),
    1
  );

  const pointsCount = data.length;
  const stepX = pointsCount > 1 ? chartWidth / (pointsCount - 1) : 0;

  // We will animate the progress of drawing
  const drawProgress = useSharedValue(0);

  useEffect(() => {
    drawProgress.value = 0;
    drawProgress.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) });
  }, [data, drawProgress]);

  const generatePath = (valueKey: keyof ChartDataPoint, isArea: boolean) => {
    if (data.length === 0) return '';
    let path = '';
    
    data.forEach((d, i) => {
      const val = d[valueKey] as number || 0;
      const x = paddingHorizontal + i * stepX;
      const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
      if (i === 0) {
        path += `M ${x} ${y} `;
      } else {
        // simple bezier curve for smoothness
        const prevVal = data[i - 1][valueKey] as number || 0;
        const prevX = paddingHorizontal + (i - 1) * stepX;
        const prevY = paddingTop + chartHeight - (prevVal / maxValue) * chartHeight;
        const cp1x = prevX + stepX / 2;
        const cp1y = prevY;
        const cp2x = x - stepX / 2;
        const cp2y = y;
        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
      }
    });

    if (isArea && data.length > 0) {
      const lastX = paddingHorizontal + (data.length - 1) * stepX;
      path += `L ${lastX} ${paddingTop + chartHeight} L ${paddingHorizontal} ${paddingTop + chartHeight} Z`;
    }

    return path;
  };

  const path1Stroke = generatePath('value1', false);
  const path1Area = generatePath('value1', true);
  const path2Stroke = data.some(d => d.value2 !== undefined) ? generatePath('value2', false) : '';
  const path2Area = data.some(d => d.value2 !== undefined) ? generatePath('value2', true) : '';
  const path3Stroke = data.some(d => d.value3 !== undefined) ? generatePath('value3', false) : '';
  
  // Use dasharray and dashoffset for stroke drawing animation
  const animatedStrokeProps = useAnimatedProps(() => {
    // A large enough length for dasharray to cover the whole width
    const pathLength = 2000; 
    return {
      strokeDasharray: `${pathLength}`,
      strokeDashoffset: pathLength - pathLength * drawProgress.value,
    };
  });

  const animatedAreaProps = useAnimatedProps(() => {
    return {
      opacity: drawProgress.value * 0.4, // Final opacity 0.4
    };
  });

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-border my-4 w-full">
      {title && <Text className="font-sans-bold text-lg text-primary mb-4">{title}</Text>}
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color1 }} />
          <Text className="font-sans-medium text-xs text-muted-foreground">{legend1}</Text>
        </View>
        {data.some(d => d.value2 !== undefined) && (
          <View className="flex-row items-center mr-4">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color2 }} />
            <Text className="font-sans-medium text-xs text-muted-foreground">{legend2}</Text>
          </View>
        )}
        {legend3 && data.some(d => d.value3 !== undefined) && (
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color3 }} />
            <Text className="font-sans-medium text-xs text-muted-foreground">{legend3}</Text>
          </View>
        )}
      </View>

      <Svg width={width - 40} height={height}>
        <Defs>
          <LinearGradient id="gradArea1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color1} stopOpacity="0.8" />
            <Stop offset="1" stopColor={color1} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="gradArea2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color2} stopOpacity="0.8" />
            <Stop offset="1" stopColor={color2} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid Lines */}
        {gridLines.map((ratio, index) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const value = Math.round(maxValue * ratio);
          let formattedValue = value.toString();
          if (value >= 100000) formattedValue = (value / 100000).toFixed(1) + 'L';
          else if (value >= 1000) formattedValue = (value / 1000).toFixed(1) + 'k';
          if (value === 0) formattedValue = '0';

          return (
            <G key={`grid-${index}`}>
              <Line
                x1={paddingHorizontal - 10}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <SvgText
                x={paddingHorizontal - 15}
                y={y + 4}
                fontSize="10"
                fill="#94a3b8"
                textAnchor="end"
              >
                {formattedValue}
              </SvgText>
            </G>
          );
        })}

        {/* Area 1 */}
        {path1Area !== '' && (
          <AnimatedPath
            d={path1Area}
            fill="url(#gradArea1)"
            animatedProps={animatedAreaProps}
          />
        )}
        
        {/* Area 2 */}
        {path2Area !== '' && (
          <AnimatedPath
            d={path2Area}
            fill="url(#gradArea2)"
            animatedProps={animatedAreaProps}
          />
        )}

        {/* Stroke 1 */}
        {path1Stroke !== '' && (
          <AnimatedPath
            d={path1Stroke}
            fill="none"
            stroke={color1}
            strokeWidth="3"
            animatedProps={animatedStrokeProps}
          />
        )}

        {/* Stroke 2 */}
        {path2Stroke !== '' && (
          <AnimatedPath
            d={path2Stroke}
            fill="none"
            stroke={color2}
            strokeWidth="3"
            animatedProps={animatedStrokeProps}
          />
        )}

        {/* Stroke 3 (e.g. GST overlaid as dashed or solid line) */}
        {path3Stroke !== '' && (
          <AnimatedPath
            d={path3Stroke}
            fill="none"
            stroke={color3}
            strokeWidth="2"
            strokeDasharray="4 4"
            animatedProps={animatedStrokeProps}
          />
        )}

        {/* X-Axis Labels */}
        {data.map((item, index) => {
          const x = paddingHorizontal + index * stepX;
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={paddingTop + chartHeight + 20}
              fontSize="12"
              fill="#64748b"
              textAnchor="middle"
            >
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
