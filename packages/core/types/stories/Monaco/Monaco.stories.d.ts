import { Meta, StoryObj } from '@storybook/vue3';
import { default as MonacoSource } from '../../components/Monaco/index.vue';
declare const meta: Meta<typeof MonacoSource>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const DarkTheme: Story;
export declare const MultipleLanguages: Story;
export declare const CustomFullDemo: Story;
