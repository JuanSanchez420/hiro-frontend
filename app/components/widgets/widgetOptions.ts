import { ArrowsRightLeftIcon, ChartBarIcon, XMarkIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

export interface WidgetOption {
    name: string
    value: string | null
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    iconColor: string
    bgColor: string
}

//     { name: 'Portfolio', value: 'portfolio', icon: LightBulbIcon, iconColor: 'text-white', bgColor: 'bg-purple-400' },
export const widgetOptions: WidgetOption[] = [
    { name: 'Swap', value: 'swap', icon: ArrowsRightLeftIcon, iconColor: 'text-white', bgColor: 'bg-blue-400' },
    { name: 'Earn', value: 'earn', icon: ChartBarIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Autonomous Instructions', value: 'instructions', icon: DocumentCheckIcon, iconColor: 'text-white', bgColor: 'bg-orange-400' },
    { name: 'Cancel', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]